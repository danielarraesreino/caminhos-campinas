from PIL import Image
import sys

try:
    path = "/home/dan/.gemini/antigravity/brain/f4176731-7b06-4b44-a92d-2413fee3bc77/media__1770954967339.jpg"
    with Image.open(path) as img:
        print(f"Dimensions: {img.size}")
except Exception as e:
    print(f"Error: {e}")
