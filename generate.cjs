const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, 'public', 'Gallery');
const categories = [
  { name: 'K-Drama', varName: 'kdrama', type: 'TV', genre: 'Drama' },
  { name: 'Bollywood', varName: 'bollywood', type: 'Movie', genre: 'Action' },
  { name: 'Hollywood', varName: 'hollywood', type: 'Movie', genre: 'Action' },
  { name: 'Animated Film', varName: 'animePicks', type: 'Movie', genre: 'Animation' },
  { name: 'Anime', varName: 'anime', type: 'Anime', genre: 'Action' }
];

let startId = 100;
let output = '';

categories.forEach(cat => {
  const catDir = path.join(galleryDir, cat.name);
  if (!fs.existsSync(catDir)) return;
  
  const movies = fs.readdirSync(catDir, { withFileTypes: true })
                   .filter(dirent => dirent.isDirectory())
                   .map(dirent => dirent.name);
  
  output += `\n// ─── ${cat.name === 'Animated Film' ? 'Anime Picks' : cat.name} ─────────────────────────────────────────────────────────────\n`;
  output += `export const ${cat.varName} = [\n`;
  
  movies.forEach(movie => {
    const movieDir = path.join(catDir, movie);
    const files = fs.readdirSync(movieDir);
    // Find file starting with 'P' or 'p'
    const posterFile = files.find(f => f.toLowerCase().startsWith('p'));
    
    if (posterFile) {
      // Clean up title by removing years like (2024) if needed, but user said "change their movie name according to where u get image from the folder", so use folder name directly.
      const posterPath = `/Gallery/${cat.name}/${movie}/${posterFile}`.replace(/\\/g, '/');
      output += `  { id: ${startId++}, title: ${JSON.stringify(movie)}, year: 2024, rating: 9.0, type: '${cat.type}', genre: '${cat.genre}', poster: ${JSON.stringify(posterPath)} },\n`;
    }
  });
  
  output += `];\n`;
});

fs.writeFileSync('generated_data.txt', output);
console.log('Generated successfully!');
