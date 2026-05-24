# Design System Strategy: The Chronos Catalyst

## 1. Overview & Creative North Star
The North Star for this design system is **"The Chronos Catalyst."** 

We are moving away from the "utility-first" look of standard productivity apps toward a high-end, editorial experience that feels like a premium timepiece or a private coaching club. The design breaks the traditional rigid grid through **intentional asymmetry** and **tonal depth**. 

By utilizing overlapping elements and high-contrast typographic scales, we create a sense of momentum (kinetic energy). This is not just a dashboard; it is a fluid environment where progress feels inevitable. We prioritize "breathing room" (generous whitespace) to ensure the user feels calm and focused, rather than overwhelmed by data.

## 2. Colors
Our palette is rooted in the depth of the night sky, using high-frequency greens and blues to highlight action and progress.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a card (using `surface_container_low`) should be distinguished from the background (`surface`) by its inherent color value, not a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
*   **Base:** `surface_dim` (#0c1321) for the overall background.
*   **Secondary Sections:** Use `surface_container_low` (#151b2a) to group related content.
*   **Interactive Cards:** Use `surface_container_high` (#232a39) to draw the eye to primary habit tracking.
*   **Nesting:** Place `surface_container_highest` elements inside `surface_container` zones to create a "nested" depth that guides the user's focus inward toward the most critical data.

### The "Glass & Gradient" Rule
To elevate the experience, use **Glassmorphism** for floating elements (like bottom navigation or modal overlays). 
*   **Implementation:** Use semi-transparent versions of `surface_variant` with a `backdrop-blur` of 20px–40px. 
*   **Signature Textures:** Main CTAs should never be flat. Use a subtle linear gradient transitioning from `primary` (#6bfb9a) to `primary_container` (#4ade80) at a 135-degree angle to provide a "glow" that signifies energy.

## 3. Typography
We use a dual-font approach to balance editorial authority with functional clarity.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision. Use `display-lg` and `headline-lg` with tight letter-spacing (-2%) to create a bold, "magazine" feel. This is where the brand’s personality lives.
*   **Body & Labels (Inter):** The workhorse. Use `body-md` and `label-md` for high legibility in habit descriptions and settings.
*   **Numeric Emphasis:** Habits are about data. All numbers (streaks, percentages, times) should use **Manrope Bold** with a higher contrast than the surrounding text. If a label is `text_secondary`, the number next to it must be `primary` or `on_surface`.

## 4. Elevation & Depth
We convey hierarchy through **Tonal Layering** rather than traditional structural lines or heavy drop shadows.

*   **The Layering Principle:** Depth is achieved by "stacking" surface tokens. Place a `surface_container_lowest` card on a `surface_container_low` section to create a soft, natural lift.
*   **Ambient Shadows:** If an element must "float" (e.g., a FAB or a detached header), use an extra-diffused shadow. 
    *   *Specs:* Blur: 32px, Y-Offset: 16px. 
    *   *Color:* Use a 6% opacity version of `primary` or `secondary` to mimic a soft glow rather than a dark "shadow."
*   **The "Ghost Border" Fallback:** For accessibility in complex data views, use a "Ghost Border." Use the `outline_variant` token at 15% opacity. Never use 100% opaque borders.

## 5. Components

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. Border-radius: `xl` (1.5rem). High-contrast `on_primary` text.
*   **Secondary:** Glassmorphic effect using `surface_container_highest` at 60% opacity with a `backdrop-blur`.
*   **Tertiary:** Text-only using `primary_fixed`, no background.

### Cards & Habit Strips
*   **Constraint:** Forbid the use of divider lines.
*   **Structure:** Separate list items using vertical white space (16px–24px) or by alternating subtle background shifts between `surface_container_low` and `surface_dim`.
*   **Corners:** Use `xl` (1.5rem) for main dashboard cards and `lg` (1rem) for nested elements.

### Progress Indicators (The Kinetic Ring)
*   **Visual:** Instead of flat bars, use concentric rings.
*   **Styling:** The "track" uses `surface_container_highest`. The "progress" uses a gradient of `primary` to `secondary`.

### Input Fields
*   **State:** The default state is a "Ghost Border" container. Upon focus, the border disappears and is replaced by a 2px `primary` bottom-heavy "glow" and a subtle shift in the background to `surface_bright`.

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts (e.g., a large headline on the left with a small supporting stat tucked into the right margin).
*   **Do** use `primary_fixed_dim` for non-critical habit streaks to maintain a calm atmosphere.
*   **Do** leverage the Spacing Scale to create "Moments of Silence" in the UI—areas with no content that allow the user to breathe.

### Don't
*   **Don't** use 100% black (#000000). Use `surface_container_lowest` for the deepest shadows.
*   **Don't** use standard Material Design "elevated" buttons with harsh drop shadows.
*   **Don't** use icons as the sole carrier of meaning. Pair them with sophisticated `label-sm` typography.
*   **Don't** clutter the view with dividers. If you feel you need a divider, increase the white space instead.