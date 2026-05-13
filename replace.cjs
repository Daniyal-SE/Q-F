const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'src', 'data', 'mockData.js');
let mockData = fs.readFileSync(mockDataPath, 'utf8');

const generatedData = fs.readFileSync(path.join(__dirname, 'generated_data.txt'), 'utf8');

// The generatedData contains all the new blocks:
// // ─── K-Drama ─── ... // ─── Anime ─── ...

// We want to replace the existing arrays with the new ones.
// We can use regex to replace from `// ─── K-Drama` to the end of its array `];\n`
const categories = ['K-Drama', 'Bollywood', 'Hollywood', 'Anime Picks', 'Anime'];
const varNames = ['kdrama', 'bollywood', 'hollywood', 'animePicks', 'anime'];

for (let i = 0; i < categories.length; i++) {
  const cat = categories[i];
  const varName = varNames[i];

  // Regex to match the old block in mockData
  // Example: // ─── K-Drama ───\nexport const kdrama = [\n ... \n];\n
  const oldBlockRegex = new RegExp(`// ─── ${cat} ───.*?\\nexport const ${varName} = \\[.*?\\];`, 'gs');

  // Extract the new block from generatedData
  const newBlockRegex = new RegExp(`// ─── ${cat} ───.*?\\nexport const ${varName} = \\[.*?\\];`, 'gs');
  const newBlockMatch = generatedData.match(newBlockRegex);

  if (newBlockMatch && newBlockMatch[0]) {
    if (mockData.match(oldBlockRegex)) {
      mockData = mockData.replace(oldBlockRegex, newBlockMatch[0]);
    } else {
      console.log(`Could not find old block for ${cat}`);
    }
  } else {
    console.log(`Could not find new block for ${cat}`);
  }
}

fs.writeFileSync(mockDataPath, mockData);
console.log("mockData.js updated successfully.");
