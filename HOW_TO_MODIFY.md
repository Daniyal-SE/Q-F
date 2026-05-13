# CineStream Modification Guide

This guide explains how to easily add, delete, or modify sections, movie cards, and images within the CineStream application.

## 1. Modifying Data (Cards, Images, Text)

All the content in the app is driven by a single data file: `src/data/mockData.js`. If you want to change what's displayed on the screen, this is usually the only file you need to touch.

### To change a movie's title, rating, or poster:
1. Open `src/data/mockData.js`.
2. Find the array where the movie lives (e.g., `trending`, `animePicks`, `comedy`).
3. Update the properties:
```javascript
{
  id: 1, 
  title: 'My New Movie Title', 
  year: 2025, 
  rating: 9.9, 
  type: 'Movie', 
  genre: 'Action',   
  poster: 'https://link-to-your-new-image.jpg' // <-- Change this to your image URL
}
```

## 2. Adding a New Row/Section on the Homepage

Adding a new row of movies is extremely simple thanks to the `ContentSection` component.

1. **Add your new data** in `src/data/mockData.js`:
```javascript
export const myNewSection = [
  { id: 101, title: 'New Movie 1', poster: 'https://img.com/1.jpg' },
  { id: 102, title: 'New Movie 2', poster: 'https://img.com/2.jpg' },
];
```

2. **Add the section to the homepage** in `src/pages/Home.jsx`:
```javascript
// At the top, import your new data:
import { trending, animePicks, myNewSection } from '../data/mockData';

// Inside the return statement, add the ContentSection wherever you want it to appear:
<ContentSection
  title="My Awesome New Section"
  items={myNewSection}
  cardProps={{ showRating: true, showYear: true }}
/>
```

## 3. Deleting a Row/Section

To remove a section from the homepage, simply delete or comment out the corresponding `<ContentSection ... />` block in `src/pages/Home.jsx`. 

```javascript
{/* I don't want the Comedy section anymore, so I delete this:
<ContentSection
  title="Comedy"
  items={comedy}
  cardProps={{ showRating: true, showYear: true }}
/>
*/}
```

## 4. Modifying the Hero Carousel (Top Sliding Banners)

The top slider on the homepage is powered by the `heroSlides` array in `src/data/mockData.js`. 

To add or change a slide:
1. Open `src/data/mockData.js`.
2. Locate `export const heroSlides = [...]`.
3. Add a new object to the array or edit an existing one. You can change the `title`, `desc` (description), `badges`, `rating`, and `bg` (background image).

## 5. Changing Component Properties

The `ContentSection` and `MediaCard` components use props (properties) to make them scalable and reusable.

For example, if you want a section to display as a **Grid** instead of a scrolling row:
```javascript
<ContentSection
  title="Grid Display"
  items={myItems}
  layout="grid"           // Changes layout to grid
  gridMinWidth="200px"    // Makes cards slightly larger
  cardSize="lg"           // Uses the large card size
  cardProps={{ showGenre: true, showBadge: false }} // Shows genres, hides badges
/>
```
