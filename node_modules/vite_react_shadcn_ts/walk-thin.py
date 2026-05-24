
from PIL import Image, ImageFilter

def process():
    img = Image.open('src/gifs/walk-transparent.gif')
    frames = []
    durations = []
    
    for i in range(getattr(img, 'n_frames', 1)):
        img.seek(i)
        f = img.convert('RGBA')
        
        r, g, b, a = f.split()
        
        # Shrink the opaque areas (erode) by 1 pixel
        a = a.filter(ImageFilter.MinFilter(3))
        
        thinned = Image.merge('RGBA', (r, g, b, a))
        frames.append(thinned)
        durations.append(img.info.get('duration', 100))
        
    frames[0].save(
        'src/gifs/walk-thin.gif',
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=img.info.get('loop', 0),
        disposal=2
    )
    frames[0].save('src/gifs/walk-static-thin.png')
    print('Thinned files created!')

process()

