---
name: Botanical Glass Architecture
colors:
  surface: '#06151c'
  surface-dim: '#06151c'
  surface-bright: '#2c3b43'
  surface-container-lowest: '#021017'
  surface-container-low: '#0e1d25'
  surface-container: '#122129'
  surface-container-high: '#1d2c34'
  surface-container-highest: '#28373f'
  on-surface: '#d5e5ef'
  on-surface-variant: '#c1c8c5'
  inverse-surface: '#d5e5ef'
  inverse-on-surface: '#23323a'
  outline: '#8b9290'
  outline-variant: '#414846'
  surface-tint: '#accec5'
  primary: '#accec5'
  on-primary: '#163630'
  primary-container: '#84a59d'
  on-primary-container: '#1b3b35'
  inverse-primary: '#45645e'
  secondary: '#c1c9bc'
  on-secondary: '#2b3229'
  secondary-container: '#41493f'
  on-secondary-container: '#afb7ab'
  tertiary: '#a6cfc3'
  on-tertiary: '#0d372f'
  tertiary-container: '#7ea69b'
  on-tertiary-container: '#133c33'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c7eae1'
  primary-fixed-dim: '#accec5'
  on-primary-fixed: '#00201b'
  on-primary-fixed-variant: '#2d4c46'
  secondary-fixed: '#dde5d8'
  secondary-fixed-dim: '#c1c9bc'
  on-secondary-fixed: '#161d15'
  on-secondary-fixed-variant: '#41493f'
  tertiary-fixed: '#c1ebdf'
  tertiary-fixed-dim: '#a6cfc3'
  on-tertiary-fixed: '#00201a'
  on-tertiary-fixed-variant: '#274e45'
  background: '#06151c'
  on-background: '#d5e5ef'
  surface-variant: '#28373f'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  glass-padding: 32px
---

## Brand & Style

This design system embodies a "Greenhouse Digital" aesthetic—an innovative fusion of organic vitality and high-end technical precision. The brand personality is professional and calm, yet forward-thinking, evoking the feeling of a quiet, sun-drenched conservatory filled with rare specimens.

The visual style is a specialized execution of **Glassmorphism**. It relies on the interplay between deep, light-absorbing slate backgrounds and ethereal, translucent layers. By treating the UI as a series of "frosted panes," we create a sense of physical depth and atmospheric perspective. The focus is on clarity, breathability, and an editorial polish that elevates portfolio content into a curated gallery experience.

## Colors

The palette is rooted in a deep slate neutral, providing a "soil" for the sage and leaf-green elements to bloom.

- **Primary (Sage):** Used for key highlights and primary actions. It represents the "living" element of the interface.
- **Secondary (Pale Mist):** A desaturated, light green used for secondary text and subtle accents.
- **Tertiary (Deep Forest):** Used for depth, container backgrounds, and hover states to ground the lighter glass elements.
- **Background:** A darkened variant of the slate seed color to maximize the luminosity of the backdrop-blur effects.

All translucent surfaces must utilize a white-tinted stroke at low opacity to simulate the edge of a glass pane, ensuring visibility against the dark background.

## Typography

The typography strategy balances the geometric authority of **Montserrat** for headlines with the warm, modern legibility of **Plus Jakarta Sans** for body text. 

Both fonts fully support the Cyrillic alphabet, ensuring a seamless experience for Russian language content without losing the "Greenhouse" character. Headlines should be set with tighter tracking to feel like architectural blocks, while body copy requires generous line-height to maintain the minimalist, airy feel of the brand.

## Layout & Spacing

The layout follows a fluid 12-column grid system designed for maximum whitespace. Elements are grouped into "terrariums"—floating glass modules that sit centered within large margins.

- **Desktop:** 12 columns with 24px gutters. Use large vertical section padding (128px+) to allow the eye to rest between portfolio pieces.
- **Mobile:** 4 columns with 20px margins. Glass containers should span full width or sit in pairs to maintain hit targets.
- **Rhythm:** All spacing is based on an 8px base unit. Component internal padding should be generous (minimum 32px for cards) to support the "airy" feel of the glass aesthetic.

## Elevation & Depth

Depth in this design system is achieved through **Backdrop Refraction** rather than traditional shadows.

1.  **Level 0 (Floor):** The deep slate background (#1B2429).
2.  **Level 1 (The Pane):** A semi-transparent surface with `backdrop-filter: blur(20px)` and a background color of `rgba(47, 62, 70, 0.4)`. This level features a 1px white border at 12% opacity.
3.  **Level 2 (The Specimen):** Content sitting atop the glass, or smaller "chip" elements that use a more opaque sage tint (`rgba(132, 165, 157, 0.2)`) to indicate interactivity.

Shadows are used sparingly; they are extremely diffused (`blur: 40px`), low-opacity (`15%`), and tinted with the primary sage color to simulate light passing through colored glass.

## Shapes

The shape language is defined by the **Pill-shaped (3)** setting. All primary containers and interactive elements utilize a minimum of 24px (1.5rem) corner radius, while large sections and display cards utilize the `rounded-xl` token (3rem/48px) to emphasize the organic, soft nature of the brand.

Buttons should be fully rounded (pill-shaped) to provide a tactile contrast against the structured grid of the portfolio.

## Components

### Buttons
Primary buttons are solid Sage (#84A59D) with deep slate text. Secondary buttons are "Ghost Glass"—transparent with a 1px border and high background blur, becoming slightly more opaque on hover.

### Glass Cards
The core of the portfolio. These must use `backdrop-filter: blur(32px)` and a subtle internal gradient (top-left to bottom-right) to simulate light hitting the glass. Use `rounded-xl` for these containers.

### Chips & Tags
Small, highly rounded elements used for project categories. These should use the Tertiary green at 20% opacity with white text, creating a "pressed leaf" effect within the UI.

### Inputs
Text fields are minimalist: a simple bottom border in `glass_stroke` color that glows into a solid Sage (#84A59D) line upon focus. Labels sit in the small, uppercase Montserrat style for a technical architectural feel.

### Lists
Portfolio lists should feature large image thumbnails with 24px rounded corners. Hovering over a list item should trigger a subtle expansion of the glass pane and an increase in the backdrop-blur intensity.