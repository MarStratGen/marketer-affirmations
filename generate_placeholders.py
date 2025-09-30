#!/usr/bin/env python3
"""Generate placeholder graphics for Marketer Affirmations"""

from PIL import Image, ImageDraw, ImageFilter
import random
import math

# Burgundy Garden color palette
BURGUNDY = (90, 16, 37)
GOLD = (185, 139, 46)
DARK_BURGUNDY = (60, 10, 25)
LIGHT_GOLD = (220, 190, 120)

def create_floral_background(width, height, filename):
    """Create a burgundy garden style background"""
    img = Image.new('RGB', (width, height), BURGUNDY)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Add gold gradient overlay
    for y in range(height):
        alpha = int(30 * (1 - y / height))
        draw.rectangle([(0, y), (width, y+1)], fill=(*GOLD, alpha))
    
    # Add random floral-like circular patterns
    random.seed(42)
    for _ in range(50):
        x = random.randint(0, width)
        y = random.randint(0, height)
        radius = random.randint(20, 80)
        alpha = random.randint(10, 40)
        color = DARK_BURGUNDY if random.random() > 0.5 else GOLD
        draw.ellipse([x-radius, y-radius, x+radius, y+radius], 
                     fill=(*color, alpha))
    
    # Slight blur for softer look
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    img.save(f'public/graphics/{filename}')
    print(f'Created {filename}')

def create_gold_background(width, height, filename):
    """Create a gold-tinted background"""
    img = Image.new('RGB', (width, height), GOLD)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Add burgundy accent
    for y in range(height):
        alpha = int(25 * (y / height))
        draw.rectangle([(0, y), (width, y+1)], fill=(*BURGUNDY, alpha))
    
    # Add pattern
    random.seed(43)
    for _ in range(40):
        x = random.randint(0, width)
        y = random.randint(0, height)
        radius = random.randint(30, 100)
        alpha = random.randint(15, 35)
        draw.ellipse([x-radius, y-radius, x+radius, y+radius], 
                     fill=(*DARK_BURGUNDY, alpha))
    
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    img.save(f'public/graphics/{filename}')
    print(f'Created {filename}')

def create_floral_corners(size, filename):
    """Create floral corner decorations"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Draw decorative corners with floral-like curves
    random.seed(44)
    
    # Top-left corner
    for i in range(5):
        offset = i * 15
        draw.arc([10+offset, 10+offset, 200-offset, 200-offset], 
                 start=180, end=270, fill=(*GOLD, 100-i*15), width=3+i)
    
    # Top-right corner (flip horizontally)
    for i in range(5):
        offset = i * 15
        draw.arc([size-200+offset, 10+offset, size-10-offset, 200-offset], 
                 start=270, end=360, fill=(*GOLD, 100-i*15), width=3+i)
    
    # Bottom-left corner
    for i in range(5):
        offset = i * 15
        draw.arc([10+offset, size-200+offset, 200-offset, size-10-offset], 
                 start=90, end=180, fill=(*GOLD, 100-i*15), width=3+i)
    
    # Bottom-right corner
    for i in range(5):
        offset = i * 15
        draw.arc([size-200+offset, size-200+offset, size-10-offset, size-10-offset], 
                 start=0, end=90, fill=(*GOLD, 100-i*15), width=3+i)
    
    # Add small circular decorations
    for corner_x, corner_y in [(80, 80), (size-80, 80), (80, size-80), (size-80, size-80)]:
        for _ in range(3):
            dx = random.randint(-40, 40)
            dy = random.randint(-40, 40)
            r = random.randint(3, 8)
            draw.ellipse([corner_x+dx-r, corner_y+dy-r, corner_x+dx+r, corner_y+dy+r],
                        fill=(*GOLD, 120))
    
    img.save(f'public/graphics/{filename}')
    print(f'Created {filename}')

def create_tape(width, height, filename):
    """Create a tape/ribbon graphic"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Tape background
    draw.rectangle([0, 0, width, height], fill=(*LIGHT_GOLD, 200))
    
    # Add texture lines
    for i in range(0, width, 20):
        alpha = 40 if i % 40 == 0 else 20
        draw.line([(i, 0), (i, height)], fill=(*GOLD, alpha), width=1)
    
    # Edges
    draw.rectangle([0, 0, width, 3], fill=(*GOLD, 255))
    draw.rectangle([0, height-3, width, height], fill=(*GOLD, 255))
    
    img.save(f'public/graphics/{filename}')
    print(f'Created {filename}')

def create_stamp(size, filename):
    """Create a stamp mark"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Outer circle
    draw.ellipse([10, 10, size-10, size-10], outline=(*BURGUNDY, 150), width=4)
    draw.ellipse([20, 20, size-20, size-20], outline=(*BURGUNDY, 150), width=2)
    
    # Text "MA" in center
    center = size // 2
    draw.text((center-15, center-20), 'MA', fill=(*BURGUNDY, 150), font=None)
    
    # Small decorative marks
    for angle in [0, 90, 180, 270]:
        rad = math.radians(angle)
        x1 = center + int(35 * math.cos(rad))
        y1 = center + int(35 * math.sin(rad))
        x2 = center + int(45 * math.cos(rad))
        y2 = center + int(45 * math.sin(rad))
        draw.line([(x1, y1), (x2, y2)], fill=(*BURGUNDY, 150), width=2)
    
    img.save(f'public/graphics/{filename}')
    print(f'Created {filename}')

def create_grain(width, height, filename):
    """Create paper grain texture"""
    img = Image.new('RGB', (width, height), (200, 200, 200))
    pixels = img.load()
    
    random.seed(45)
    for y in range(height):
        for x in range(width):
            noise = random.randint(-30, 30)
            val = 200 + noise
            pixels[x, y] = (val, val, val)
    
    img.save(f'public/graphics/{filename}')
    print(f'Created {filename}')

# Generate all placeholder graphics
print('Generating placeholder graphics...')
create_floral_background(1080, 1080, 'bg-main.jpg')
create_gold_background(1080, 1080, 'bg-gold.jpg')
create_floral_corners(1080, 'florals-corners.png')
create_tape(1080, 120, 'tape.png')
create_stamp(200, 'stamp-ma.png')
create_grain(512, 512, 'grain.png')
print('All graphics created successfully!')
