---
name: Cinematic Immersive System
colors:
  surface: '#1d100f'
  surface-dim: '#1d100f'
  surface-bright: '#463534'
  surface-container-lowest: '#170b0a'
  surface-container-low: '#261817'
  surface-container: '#2b1c1b'
  surface-container-high: '#362625'
  surface-container-highest: '#41312f'
  on-surface: '#f7dcda'
  on-surface-variant: '#e2bebb'
  inverse-surface: '#f7dcda'
  inverse-on-surface: '#3d2c2b'
  outline: '#a98987'
  outline-variant: '#5a403f'
  surface-tint: '#ffb3ae'
  primary: '#ffb3ae'
  on-primary: '#68000b'
  primary-container: '#fa5956'
  on-primary-container: '#5c0008'
  inverse-primary: '#b4252a'
  secondary: '#ffb4ab'
  on-secondary: '#690006'
  secondary-container: '#8d1515'
  on-secondary-container: '#ff998f'
  tertiary: '#73d6da'
  on-tertiary: '#003739'
  tertiary-container: '#359fa3'
  on-tertiary-container: '#002f31'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3ae'
  on-primary-fixed: '#410004'
  on-primary-fixed-variant: '#920516'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#8d1515'
  tertiary-fixed: '#90f2f6'
  tertiary-fixed-dim: '#73d6da'
  on-tertiary-fixed: '#002021'
  on-tertiary-fixed-variant: '#004f52'
  background: '#1d100f'
  on-background: '#f7dcda'
  surface-variant: '#41312f'
typography:
  display-xl:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-edge: 48px
  stack-xs: 4px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system is engineered to deliver a high-end, theatrical experience that prioritizes content immersion. The aesthetic is defined as **Futuristic Noir**, blending deep obsidian surfaces with aggressive, high-energy crimson accents. 

The strategy focuses on "the disappearing interface"—where the UI recedes during playback but feels powerful and tactical during navigation. We utilize **Glassmorphism** to maintain a sense of depth and spatial awareness, and **High-Contrast Dark** surfaces to ensure color vibrancy in movie posters and anime key art. The emotional goal is to make the user feel like they are operating a sophisticated media command center.

## Colors

The palette is anchored by a custom-black background (#1D1616) that has a slight warm undertone to prevent the "dead" look of pure black. 

- **Primary Action (#D84040):** A vibrant, "Electric Cinnabar" used for CTAs and critical status indicators.
- **Secondary Accent (#8E1616):** A deep "Blood Crimson" used for hover states, subtle borders, and secondary buttons.
- **Neutral/Text (#EEEEEE):** An off-white "Moonlight" that reduces eye strain while maintaining maximum legibility against dark backgrounds.
- **Surface Strategy:** Use semi-transparent layers for navigation bars to allow content colors to bleed through, creating a dynamic, atmospheric feel.

## Typography

The typography system pairs the aggressive, geometric authority of **Montserrat** for headings with the technical precision of **Inter** for long-form metadata.

**Space Grotesk** is introduced sparingly for labels (like "4K", "SUB", "DUB") to reinforce the futuristic, tech-heavy aesthetic. All headlines should utilize tight letter-spacing to appear more cinematic and "locked-in." Body text maintains a generous line height to ensure readability in low-light environments.

## Layout & Spacing

The system employs a **Fluid Grid** model with a 12-column structure for browsing and a focused, centered layout for account/setting views. 

- **Horizontal Rhythm:** Generous 48px outer margins are required to give the content a "widescreen" cinematic feel.
- **Vertical Rhythm:** Use an 8px base unit. Hero sections should occupy 70-80% of the viewport height to maximize visual impact.
- **Card Grids:** Use 24px gutters to allow movie posters enough "breathing room" to prevent the interface from feeling cluttered.

## Elevation & Depth

Depth is conveyed through **Light Emission** rather than traditional shadows.

1.  **Base Layer:** The solid #1D1616 background.
2.  **Surface Layer:** Semi-transparent cards with a 1px inner border (white at 10% opacity) to simulate glass edges.
3.  **Backdrop Blur:** Use a 20px to 40px blur radius for all overlays and navbars.
4.  **Glow States:** Primary buttons and active selection states utilize a `0px 0px 15px` outer glow in #D84040 to simulate a neon or holographic emission.
5.  **Hover Depth:** On hover, media cards should scale by 1.05x and gain a subtle red outer glow to signify focus.

## Shapes

The design system uses a **Soft (0.25rem)** rounding strategy. This provides a modern, sleek feel without the "playfulness" of high-radius curves.

- **Buttons & Chips:** Use `rounded-lg` (0.5rem) for a more tactile, ergonomic look.
- **Media Cards:** Use `rounded-sm` (0.25rem) to maintain the structural integrity of the artwork and posters.
- **Search Bars:** Should be the only elements approaching a pill-shape to distinguish them as functional input tools.

## Components

### Buttons
- **Primary:** Background #D84040 with a linear gradient (top to bottom) from #D84040 to #8E1616. Text color is #EEEEEE. Add a 10px glow on hover.
- **Secondary:** Transparent background with a 1.5px border of #8E1616.

### Media Cards
- **Aspect Ratio:** 2:3 for Movies/Anime, 16:9 for Episodes.
- **Interactions:** On hover, the card scales up, and a "Play" icon overlay appears with a glassmorphic background blur.

### Navigation Bar
- **Style:** Fixed to top, 100% width, #1D1616 at 70% opacity with a `backdrop-filter: blur(20px)`.
- **Active State:** A 2px bottom border in #D84040 that spans 50% of the menu item's width.

### Input Fields
- **Style:** Darker than the background (#130E0E) with a subtle #8E1616 focus ring.
- **Icons:** Use thin-stroke (1.5px) futuristic icons.

### Progress Bars (Video Player)
- **Track:** Dark grey (#333333).
- **Progress:** #D84040 with a trailing glow.
- **Buffer:** #8E1616 at 40% opacity.