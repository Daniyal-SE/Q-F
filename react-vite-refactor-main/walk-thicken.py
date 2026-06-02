
from PIL import Image

def process():
    img = Image.open('src/gifs/walk-transparent.gif')
    frames = []
    durations = []
    
    for i in range(getattr(img, 'n_frames', 1)):
        img.seek(i)
        f = img.convert('RGBA')
        
        w, h = f.size
        thick = Image.new('RGBA', (w, h), (255, 255, 255, 0))
        
        # Thicken by 1 pixel in all directions (and some 2px for boldness)
        shifts = [(0,0), (1,0), (-1,0), (0,1), (0,-1), (1,1), (-1,-1), (-1,1), (1,-1), (2,0), (-2,0), (0,2), (0,-2)]
        for dx, dy in shifts:
            temp = Image.new('RGBA', (w, h), (255, 255, 255, 0))
            temp.paste(f, (dx, dy))
            thick = Image.alpha_composite(thick, temp)
            
        frames.append(thick)
        durations.append(img.info.get('duration', 100))
        
    frames[0].save(
        'src/gifs/walk-thick.gif',
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=img.info.get('loop', 0),
        disposal=2
    )
    frames[0].save('src/gifs/walk-static-thick.png')
    print('Thickened files created successfully!')

process()

