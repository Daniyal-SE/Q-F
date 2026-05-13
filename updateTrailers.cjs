const fs = require('fs');
const path = require('path');

async function run() {
  const mockDataPath = path.join(__dirname, 'src', 'data', 'mockData.js');
  let mockData = fs.readFileSync(mockDataPath, 'utf8');
  
  const parts = mockData.split('title: "');
  for (let i = 1; i < parts.length; i++) {
    const titleEnd = parts[i].indexOf('"');
    const title = parts[i].substring(0, titleEnd);
    
    const trailerIdx = parts[i].indexOf("trailer: '");
    if (trailerIdx !== -1) {
      const lineEnd = parts[i].indexOf("',", trailerIdx);
      const trailerLine = parts[i].substring(trailerIdx, lineEnd + 1);
      
      if (trailerLine.includes('w3schools') || trailerLine.includes('mov_bbb.mp4')) {
        console.log('Fetching trailer for:', title);
        try {
          const query = title + ' official trailer site:youtube.com';
          const r = await fetch('https://lite.duckduckgo.com/lite/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            body: 'q=' + encodeURIComponent(query)
          });
          const html = await r.text();
          // Extract duckduckgo redirect link to youtube
          const m = html.match(/v(?:%3D|=)([a-zA-Z0-9_-]{11})/);
          if (m) {
            const videoId = m[1];
            const newTrailer = `trailer: 'https://www.youtube.com/embed/${videoId}'`;
            parts[i] = parts[i].replace(trailerLine, newTrailer);
            console.log(' -> Found:', videoId);
          } else {
            console.log(' -> No video found');
          }
          // Delay to prevent DDG block
          await new Promise(res => setTimeout(res, 2000));
        } catch(e) {
          console.error(' -> Error for', title);
        }
      } else {
        console.log('Skipping', title);
      }
    }
  }
  
  mockData = parts.join('title: "');
  fs.writeFileSync(mockDataPath, mockData);
  console.log('Done mapping real YouTube IDs to mockData.js!');
}

run();
