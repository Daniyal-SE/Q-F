
from PIL import Image

def process():
    img = Image.open('src/gifs/walk.gif')
    frames = []
    durations = []
    
    for i in range(getattr(img, 'n_frames', 1)):
        img.seek(i)
        f = img.convert('RGBA')
        data = list(f.getdata())
        
        new_data = []
        for r,g,b,a in data:
            if (r + g + b) > 380:
                new_data.append((255, 255, 255, 0)) # Transparent
            else:
                new_data.append((0, 0, 0, 255)) # Opaque Black
                
        f.putdata(new_data)
        frames.append(f)
        durations.append(img.info.get('duration', 100))
        
    frames[0].save(
        'src/gifs/walk-transparent.gif',
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=img.info.get('loop', 0),
        disposal=2
    )
    print('Saved as walk-transparent.gif')

process()

