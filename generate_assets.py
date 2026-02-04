import wave
import math
import random
import os
import struct

def generate_wav(filename, duration=1.0, freq=440.0, type='sine'):
    sample_rate = 44100
    n_frames = int(duration * sample_rate)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        data = []
        for i in range(n_frames):
            t = i / sample_rate
            if type == 'sine':
                value = int(32767.0 * math.sin(2 * math.pi * freq * t))
            elif type == 'noise':
                value = int(random.uniform(-1, 1) * 32767.0 * 0.5) # 0.5 amplitude
            else:
                value = 0
            data.append(struct.pack('<h', value))
            
        wav_file.writeframes(b''.join(data))
    print(f"Generated {filename}")

def generate_svg_noise(filename):
    width = 200
    height = 200
    svg_content = f'<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter></defs><rect width="100%" height="100%" filter="url(#noise)" opacity="0.5"/></svg>'
    
    with open(filename, 'w') as f:
        f.write(svg_content)
    print(f"Generated {filename}")

os.makedirs('public/sounds', exist_ok=True)

# Generate assets
generate_wav('public/sounds/traffic.wav', duration=5.0, type='noise')
generate_wav('public/sounds/rain_heavy.wav', duration=5.0, type='noise')
generate_wav('public/sounds/click.wav', duration=0.1, freq=880, type='sine')

generate_svg_noise('public/texture-noise.svg')
