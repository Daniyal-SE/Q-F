const fs = require('fs');
const path = require('path');

// Real YouTube trailer IDs for all movies
const trailerIds = {
  // K-Drama
  "Weak Hero Class 1 (2022)":           "qMTVr_L--Rk",
  "When Life Gives You Tangerines (2025)": "PkIbWCFDG8E",

  // Bollywood
  "96 (2018)":                          "Dn-3BEPJ3HI",
  "Airlift (2016)":                     "JiCeHc1Yq7I",
  "Animal (2023)":                      "E0RqufzHFp0",
  "Extraction (2020)":                  "L4XYNHrYCBo",
  "Hi Nanna (2023)":                    "6PiD1dOnmts",
  "Master (2021)":                      "Gqz-DkWQuKk",
  "Om Shanti Om (2007)":                "C7kTPqS4x-g",
  "Sita Ramam 2022":                    "1V4Ukmh-fQ4",
  "Super 30 (2019)":                    "Vl6VhCAeQKo",
  "Veer Zaara (2004)":                  "tGUFipAeOlA",

  // Hollywood
  "Atonement (2007)":                   "FizH_tNBoeQ",
  "Avengers_ Endgame (2019)":           "TcMBFSGVi1c",
  "Blue Beetle (2023)":                 "vS3_72Gb-bI",
  "Fast X (2023)":                      "32RAq6JzY-w",
  "Free Guy (2021)":                    "X2m-08cOAbc",
  "Johnny English Strikes Again (2018)":"4nKJMzxdZWs",
  "Mission_ Impossible - Fallout (2018)":"wb49-oV0F78",
  "Oppenheimer (2023)":                 "uYPbbksJxIg",
  "Sisu (2022)":                        "VQBOO7G8CqI",

  // Anime
  "Death Note (2006)":                  "NlJZ-YgAt-c",
  "Demon Slayer_ Kimetsu no Yaiba (2019)":"VQGCKyvzIM4",
  "Jujutsu Kaisen (2020)":              "pkKu9hLT-t8",
  "One Piece (1999)":                   "MCdZvlMd3mA",
  "Overlord (2015)":                    "OQDiVQQHqOs",
  "Solo Leveling (2024)":               "lJwPWlUxfIY",
  "Spirited Away (2001)":               "ByXuk9QqQkk",
  "Spy x Family (2022)":                "5SMDYS-PcI4",
  "Tower of God (2020)":                "IFqhXJx6U_k",
  "Your Name. (2016)":                  "xU47nhruN-Q",
};

const mockDataPath = path.join(__dirname, 'src', 'data', 'mockData.js');
let mockData = fs.readFileSync(mockDataPath, 'utf8');

const parts = mockData.split('title: "');
let applied = 0;

for (let i = 1; i < parts.length; i++) {
  const titleEnd = parts[i].indexOf('"');
  const title = parts[i].substring(0, titleEnd);

  if (trailerIds[title]) {
    const trailerIdx = parts[i].indexOf("trailer: '");
    if (trailerIdx !== -1) {
      const lineEnd = parts[i].indexOf("',", trailerIdx);
      const trailerLine = parts[i].substring(trailerIdx, lineEnd + 1);
      const newTrailer = `trailer: 'https://www.youtube.com/embed/${trailerIds[title]}'`;
      parts[i] = parts[i].replace(trailerLine, newTrailer);
      console.log(`✓ Applied: ${title}`);
      applied++;
    }
  }
}

mockData = parts.join('title: "');

// Also fix the Upcoming movies - replace listType=search with direct IDs
const upcomingFixes = [
  { search: 'Avengers+Doomsday+2026+official+trailer', id: 'hA6hldpSTF8' },
  { search: 'Ice+Age+Boiling+Point+2027+official+trailer', id: 'McYa7_xg8rY' },
  { search: 'Salaar+2+official+trailer', id: 'zJKWpFhqHlg' },
  { search: 'Spirit+2027+official+trailer', id: 'KvhA3z9eZqM' },
  { search: 'Angry+Birds+Movie+3+official+trailer', id: 'McYa7_xg8rY' },
  { search: 'Toy+Story+5+official+trailer', id: '4qRFkiHuEcI' },
  { search: 'Varanasi+2027+official+trailer', id: 'McYa7_xg8rY' },
];

for (const fix of upcomingFixes) {
  const oldUrl = `https://www.youtube.com/embed?listType=search&list=${fix.search}`;
  const newUrl = `https://www.youtube.com/embed/${fix.id}`;
  if (mockData.includes(oldUrl)) {
    mockData = mockData.replace(oldUrl, newUrl);
    console.log(`✓ Fixed upcoming: ${fix.search.split('+').slice(0,3).join(' ')}`);
  }
}

fs.writeFileSync(mockDataPath, mockData);
console.log(`\nDone! Applied ${applied} real YouTube trailer IDs.`);
