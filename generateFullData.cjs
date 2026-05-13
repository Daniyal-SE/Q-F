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

// Helper to generate a generic 3-line description
function generateDescription(title, genre) {
  return `In this captivating ${genre.toLowerCase()} masterpiece, "${title}" takes audiences on an unforgettable journey full of twists and turns. As the characters navigate unexpected challenges, their resilience and courage are put to the ultimate test. With stunning visuals and a gripping storyline, this is a must-watch experience that will keep you on the edge of your seat from beginning to end.`;
}

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
    
    // Find poster (starts with 'p')
    const posterFile = files.find(f => f.toLowerCase().startsWith('p'));
    const posterPath = posterFile ? `/Gallery/${cat.name}/${movie}/${posterFile}`.replace(/\\/g, '/') : "poster('fallback')";
    
    // Find stills (starts with a number)
    const stillFiles = files.filter(f => /^\d/.test(f));
    const stills = stillFiles.map(f => `/Gallery/${cat.name}/${movie}/${f}`.replace(/\\/g, '/'));
    
    const id = startId++;
    const desc = generateDescription(movie, cat.genre);
    
    // Build object
    output += `  {
    id: ${id},
    title: ${JSON.stringify(movie)},
    year: 2024,
    rating: 9.0,
    type: '${cat.type}',
    genre: '${cat.genre}',
    poster: ${JSON.stringify(posterPath)},
    hero: ${JSON.stringify(posterPath)},
    genres: ['${cat.genre}', 'Drama', 'Thriller'],
    duration: '2h 15m',
    rating_label: 'PG-13',
    description: ${JSON.stringify(desc)},
    director: 'Acclaimed Director',
    writer: 'Award-winning Writer',
    studio: 'Global Studios',
    language: 'Original',
    stills: ${JSON.stringify(stills)},
    trailer: 'https://www.w3schools.com/html/mov_bbb.mp4',
    similar: []
  },\n`;
  });
  
  output += `];\n`;
});

// Now replace the arrays in mockData.js using the same logic as before
const mockDataPath = path.join(__dirname, 'src', 'data', 'mockData.js');
let mockData = fs.readFileSync(mockDataPath, 'utf8');

const varNames = ['kdrama', 'bollywood', 'hollywood', 'animePicks', 'anime'];
categories.forEach((cat, i) => {
  const vName = varNames[i];
  const oldBlockRegex = new RegExp(`// ─── ${cat.name === 'Animated Film' ? 'Anime Picks' : cat.name} ───.*?\\nexport const ${vName} = \\[.*?\\];`, 'gs');
  const newBlockRegex = new RegExp(`// ─── ${cat.name === 'Animated Film' ? 'Anime Picks' : cat.name} ───.*?\\nexport const ${vName} = \\[.*?\\];`, 'gs');
  const newBlockMatch = output.match(newBlockRegex);
  
  if (newBlockMatch && newBlockMatch[0]) {
    if (mockData.match(oldBlockRegex)) {
      mockData = mockData.replace(oldBlockRegex, newBlockMatch[0]);
    }
  }
});

// Append helper function if it doesn't exist
if (!mockData.includes('export const getMediaById')) {
  mockData += `\n// ─── Helper function to find media by ID ───────────────────────────────────\n`;
  mockData += `export const getMediaById = (id) => {\n`;
  mockData += `  const allMedia = [...kdrama, ...bollywood, ...hollywood, ...animePicks, ...anime, ...trending, ...comedy, ...action, ...searchResults];\n`;
  mockData += `  // Fallback to original movieDetail if not found in arrays\n`;
  mockData += `  return allMedia.find(m => m.id === Number(id)) || movieDetail;\n`;
  mockData += `};\n`;
}

fs.writeFileSync(mockDataPath, mockData);
console.log("mockData.js successfully augmented with full details and stills!");
