from PIL import Image, ImageChops
import sys
import os

def smart_crop(input_path, output_path):
    print(f"Processing {input_path}")
    try:
        img = Image.open(input_path).convert("RGBA")
        
        # 1. Detect background color (use top-left pixel)
        bg = img.getpixel((0, 0))
        print(f"Background color detected: {bg}")

        # 2. Create a mask of non-background pixels
        # Create a new image with the background color
        bg_img = Image.new("RGBA", img.size, bg)
        # Calculate difference
        diff = ImageChops.difference(img, bg_img)
        # Convert to grayscale to simplify
        diff = diff.convert("L")
        
        # Threshold to remove noise (e.g. compression artifacts)
        # Any pixel with diff > 20 is considered content
        threshold = 20
        mask = diff.point(lambda p: 255 if p > threshold else 0)
        
        # 3. Analyze vertical projection to find gaps
        # Get bounding box of the entire content first
        bbox = mask.getbbox()
        if not bbox:
            print("No content found!")
            return

        print(f"Content bbox: {bbox}")
        # bbox is (left, top, right, bottom)
        
        # Scan rows within the vertical range of the bbox
        left, top, right, bottom = bbox
        
        # We look for a horizontal gap to separate Logo (top) from Text (bottom)
        # We scan from top to bottom.
        # We expect: Content (Logo) -> Gap (Whitespace) -> Content (Text)
        
        row_has_content = []
        width = img.width
        # Optimize: check only center column? No, check row slice in mask
        # Converting mask to data is easier
        mask_data = mask.load()
        
        content_blocks = []
        in_block = False
        block_start = -1
        
        empty_row_threshold = 0.01 # Allow 1% pixels to be noisy? No, strict for now.
        
        # Scan rows
        for y in range(top, bottom + 1):
            # Check if row has content
            row_content = False
            for x in range(left, right):
                if mask_data[x, y] > 0:
                    row_content = True
                    break
            
            if row_content:
                if not in_block:
                    in_block = True
                    block_start = y
            else:
                if in_block:
                    in_block = False
                    # End of block
                    content_blocks.append((block_start, y))
        
        if in_block:
             content_blocks.append((block_start, bottom))
             
        print(f"Found {len(content_blocks)} vertical content blocks: {content_blocks}")
        
        # Heuristic: The logo is likely the first big block.
        # If only 1 block, maybe text and logo are touching?
        # If multiple, take the first one.
        
        # Filter out noise (blocks smaller than 10 pixels height)
        significant_blocks = [b for b in content_blocks if (b[1] - b[0]) > 10]
        
        print(f"Significant blocks (>10px): {significant_blocks}")
        
        if len(significant_blocks) >= 2:
            # Assume first significant block is logo, rest is text
            # But wait, if there are multiple parts of the logo?
            # User said "Remove text".
            # Usually text is at the bottom.
            # Let's take the first significant block.
            
            logo_top = significant_blocks[0][0]
            logo_bottom = significant_blocks[0][1]
            
            # Refine horizontal bbox for this vertical slice
            logo_mask = mask.crop((0, logo_top, img.width, logo_bottom))
            logo_bbox = logo_mask.getbbox()
            
            if logo_bbox:
                final_crop_box = (logo_bbox[0], logo_top + logo_bbox[1], logo_bbox[2], logo_top + logo_bbox[3])
                print(f"Cropping to first significant block: {final_crop_box}")
                final_img = img.crop(final_crop_box)
            else:
                 final_img = img.crop((left, logo_top, right, logo_bottom))

        elif len(significant_blocks) == 1:
            print("Only 1 significant block found. It might contain both logo and text with no gap.")
            # If so, we might need to look for a gap in horizontal projection?
            # Or maybe the text is just close.
            # User said "Remove text".
            # If we strictly can't find a gap, we might just return the whole thing cropped to bbox.
            # But let's try to be smarter. 
            # If the block is very tall (e.g. > 80% of image), maybe force a cut?
            # But likely there is a gap if we lower tolerance?
            # For now, just crop to bbox of that block.
            b = significant_blocks[0]
            # Get tighter bbox
            mask_crop = mask.crop((0, b[0], img.width, b[1]))
            bbox = mask_crop.getbbox()
            final_crop_box = (bbox[0], b[0] + bbox[1], bbox[2], b[0] + bbox[3])
            print(f"Cropping to single block bbox: {final_crop_box}")
            final_img = img.crop(final_crop_box)
        else:
             print("No significant blocks found. Using full bbox.")
             final_img = img.crop(bbox)

        # 4. Make background transparent?
        # User didn't explicitly ask, but "Crop" implies extracting the object.
        # If we save as PNG, we can use the alpha channel.
        # Simple transparency: Convert all matching background pixels to transparent?
        # Only if contiguous from outside? (Flood fill)
        # Let's try simple flood fill from corners of the CROP (if compatible).
        
        # For now, just saving the crop is safer than messing up transparency.
        # But convert to PNG.

        final_img.save(output_path)
        print(f"Saved cropped image to {output_path}")

    except Exception as e:
        print(f"Error processing image: {e}")
        import traceback
        traceback.print_exc()

path = "/home/dan/.gemini/antigravity/brain/f4176731-7b06-4b44-a92d-2413fee3bc77/media__1770954967339.jpg"
output = "public/logo-cropped.png"

smart_crop(path, output)
