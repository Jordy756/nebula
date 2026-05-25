# Scale — Style Reference
>
> Midnight Command Center: An expanse of polished dark surfaces, illuminated by precise white text and the occasional shimmer of an iridescent, almost holographic, light.

**Theme:** dark

This design system evokes a sense of deep, sophisticated technology within a secure, high-contrast environment. The dominant ultra-dark palette, punctuated by crisp white text and a subtle, iridescent gradient, creates an atmosphere of serious innovation. Minimal use of vibrant colors ensures that any color interaction is highly deliberate, like an indicator light on a complex machine. Typography features whisper-light headlines, conveying authority through understated elegance against the stark backdrop.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Space | `#000000` | `--color-deep-space` | Primary page background, card backgrounds, creating a high-contrast canvas. |
| Ghost White | `#ffffff` | `--color-ghost-white` | Primary text color for headlines and body text, accentuating information against the dark background. Also used for borders on interactive elements. |
| Iron Slate | `#a1a1a1` | `--color-iron-slate` | Secondary text for less prominent information, active navigation links, and subtle borders. |
| Halo Pale | `#f4f0ff` | `--color-halo-pale` | Subtle, near-white text for secondary links and body text in less prominent sections. This provides a very soft contrast against black. |
| Shadow Tint | `#020202` | `--color-shadow-tint` | Subtle shadows and background for elements that need a touch more depth than pure black. |
| Subtle Gray | `#e5e5e5` | `--color-subtle-gray` | Text and icon color, for details that require slightly less prominence than Ghost White. |
| Iridescent Glow | `#bbdef2` | `--color-iridescent-glow` | Backgrounds of geometric abstract shapes, providing a luminous, futuristic visual accent. |
| Spectrum Flare | `#d1aad7` | `--color-spectrum-flare` | Used for the lighter parts of the iridescent gradient, giving it a soft, ethereal quality. |
| Vivid Crimson | `#ff6467` | `--color-vivid-crimson` | Indicator or accent background, used sparingly to draw attention. |
| Goldenrod | `#ffd600` | `--color-goldenrod` | Indicator or accent background, used sparingly for specific highlight. |
| Emerald Green | `#72ce7b` | `--color-emerald-green` | Indicator or accent background, used sparingly for specific highlight. |
| Dark Rainbow Gradient | `linear-gradient(to right bottom in oklab, rgb(154, 154, 154) 0%, rgb(26, 26, 26) 50%, rgb(106, 106, 106) 100%)` | `--color-dark-rainbow-gradient` | Used for highly stylized, abstract background elements, providing a subtle shimmer that hints at dimension and data flow. |

## Tokens — Typography

### Inter — Standard body text, navigation elements, buttons, and various UI labels. Its wide range of sizes and normal weight support the bulk of content, ensuring readability without distracting from the main brand typography. · `--font-inter`

- **Substitute:** system-ui, sans-serif
- **Weights:** 400, 500
- **Sizes:** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`
- **Line height:** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`
- **Role:** Standard body text, navigation elements, buttons, and various UI labels. Its wide range of sizes and normal weight support the bulk of content, ensuring readability without distracting from the main brand typography.

### Host Grotesk — Primary display font for headlines and sub-headlines. The signature weight 300 for large sizes creates a whisper-quiet yet authoritative tone, prioritizing understatement over visual shouting, which is distinctive for a high-tech brand. · `--font-host-grotesk`

- **Substitute:** Montserrat, sans-serif
- **Weights:** 300, 400
- **Sizes:** `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`, `text-7xl`, `text-8xl`
- **Line height:** `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`, `text-7xl`, `text-8xl`
- **Role:** Primary display font for headlines and sub-headlines. The signature weight 300 for large sizes creates a whisper-quiet yet authoritative tone, prioritizing understatement over visual shouting, which is distinctive for a high-tech brand.

## Tokens — Spacing & Shapes

**Base unit:** 8px
**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `p-2` / `m-2` / `gap-2` |
| 16 | 16px | `p-4` / `m-4` / `gap-4` |
| 24 | 24px | `p-6` / `m-6` / `gap-6` |
| 32 | 32px | `p-8` / `m-8` / `gap-8` |
| 40 | 40px | `p-10` / `m-10` / `gap-10` |
| 48 | 48px | `p-12` / `m-12` / `gap-12` |
| 64 | 64px | `p-16` / `m-16` / `gap-16` |
| 72 | 72px | `p-18` / `m-18` / `gap-18` |
| 80 | 80px | `p-20` / `m-20` / `gap-20` |
| 192 | 192px | `p-48` / `m-48` / `gap-48` |
| 224 | 224px | `p-56` / `m-56` / `gap-56` |

### Border Radius

| Element | Value | Native Tailwind Class |
|---------|-------|-----------------------|
| lists | 4px | `rounded-sm` |
| default | 8px | `rounded-md` |
| links | 16px | `rounded-2xl` |

### Layout

- **Section gap:** `gap-8`
- **Card padding:** `p-6`
- **Element gap:** `gap-2`

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset` | `--shadow-subtle` |

## Components

### Navigation Link

**Role:** Primary navigation item

White text (Ghost White #ffffff) on a transparent background, 4px vertical padding and 0px horizontal padding. Underlines appear on hover/active states, with no distinct border radius. Font is Inter 16px weight 400.

### Secondary Hero Button (Text Link)

**Role:** Secondary call to action

Ghost White #ffffff text on a transparent background, with an arrow icon. Font is Inter 16px weight 400. Padding of 17px horizontal and 12px vertical. No explicit border or radius.

### Feature Card

**Role:** Content container for features

Implicitly dark background (likely Deep Space #000000 or Shadow Tint #020202) with rounded corners (8px). Text is typically Ghost White #ffffff for headings and Halo Pale #f4f0ff or Iron Slate #a1a1a1 for body copy. Contains abstract image elements.

## Do's and Don'ts

### Do

- Prioritize Deep Space (#000000) for backgrounds and Ghost White (#ffffff) for primary text to maintain high contrast and sophistication.
- Use Host Grotesk font with weight 300 for all large headlines (48px and above) to achieve an understated, authoritative tone.
- Apply Iron Slate (#a1a1a1) for secondary text and active navigation items to provide subtle differentiation without losing readability.
- Employ the Iridescent Glow (#bbdef2) and Spectrum Flare (#d1aad7) gradient only for abstract geometric elements or distinctive brand accents, not for interactive components.
- Maintain generous vertical spacing between sections, using multiples of 32px to provide breathing room on the dark canvas.
- Use 8px border radius as the default for most containers and images, with 16px for larger interactive links, and 4px for smaller list items.

### Don't

- Do not introduce highly saturated colors for general UI elements; reserve them for specific accent indicators if truly necessary.
- Avoid heavy drop shadows; the design relies on subtle background variations and text contrast for depth, with minimal inset shadows.
- Do not use Host Grotesk font for body text; reserve it for headlines and maintain its distinctive impact.
- Avoid excessive use of Halo Pale (#f4f0ff) for primary content; its low contrast is intended for secondary or subtle elements.
- Do not use generic system borders; interactive elements should feature white or subtle gray borders for consistency.
- Avoid dense information blocks; use ample White Space, especially on dark backgrounds, to enhance clarity and visual weight.

## Imagery

The visual language is characterized by abstract, geometric 3D renders with iridescent, gradient-filled surfaces (Iridescent Glow #bbdef2, Spectrum Flare #d1aad7). These graphics are contained and serve as decorative visual anchors in the dark space, emphasizing a futuristic, AI-driven aesthetic. Photography is minimal, if present, and product screenshots are likely stylized to fit the dark theme. Icons are typically white or subtle gray, outlined, reinforcing the clean, high-tech identity. The imagery acts primarily as atmospheric branding and conceptual illustration, occupying significant visual space relative to text in some hero sections, but is not dense or overwhelming.

## Layout

The page primarily uses a max-width contained layout, centered on the screen, though the hero section spans full-bleed with its striking dark background and large, centered typography. The hero features a simple, prominent headline over a dark void, balanced by abstract 3D graphics on one side. Subsequent sections predominantly follow a vertical stacking pattern with consistent Deep Space (#000000) backgrounds, occasionally introducing subtly different dark shades for content blocks. Content is often presented in centered stacks or simple two-column arrangements (text alongside an image/graphic). Navigation is a sticky top bar with minimal links and clear call-to-action buttons. Vertical spacing between sections is generous (32px and above), creating a spacious and unhurried rhythm.

## Agent Prompt Guide

### Quick Color Reference

- Text (Primary): #ffffff (Ghost White)
- Background (Primary): #000000 (Deep Space)
- CTA Button Background: transparent
- CTA Button Border: #ffffff (Ghost White)
- Accent Graphic: #bbdef2 (Iridescent Glow)

### Example Component Prompts

1. Create a Hero Section: Full-width Deep Space #000000 background. Centered headline 'Breakthrough AI from Data to Deployment' using Host Grotesk 89px weight 300, Ghost White #ffffff. Subtext 'Scale delivers proven data...' using Inter 20px weight 400, Halo Pale #f4f0ff, line-height 1.6. Two buttons: 'Book a Demo' with Ghost White #ffffff text, transparent background, 1px Ghost White #ffffff border, 17px horizontal, 12px vertical padding; and 'Build AI' with Ghost White #ffffff text, transparent background, no border, 17px horizontal, 12px vertical padding. Include an abstract geometric graphic using Iridescent Glow #bbdef2 and Spectrum Flare #d1aad7 colors on the right side.
2. Design a Navigation Bar: Deep Space #000000 background, 59-147px height. Logo 'Scale' using Inter 24px weight 500, Ghost White #ffffff. Navigation links 'Products', 'Research', 'Enterprise', 'Government', 'Resources' using Inter 16px weight 400, Ghost White #ffffff, white on hover, 4px vertical padding, 0px horizontal padding. Right-aligned buttons 'Book a Demo' (Ghost White #ffffff text, 1px Ghost White #ffffff border, transparent background) and 'Log In' (Ghost White #ffffff text, transparent background, no border).
3. Create a Testimonial Block: Deep Space #000000 background. Headline 'We have changed the game...' using Host Grotesk 48px weight 300, Ghost White #ffffff. A testimonial card: 8px border-radius, transparent background with inset shadow rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset. Quote text '"We partnered with Scale AI..."' using Inter 20px weight 400, Ghost White #ffffff. Attribution 'Mark Zuckerberg' using Inter 16px weight 500, Halo Pale #f4f0ff.

## Similar Brands

- **OpenAI** — Shares a sophisticated, dark-mode focused UI with strong typography and minimal, controlled use of color, conveying high-tech and serious intent.
- **Databricks** — Employs an enterprise-grade dark theme, often featuring abstract geometric visuals and a clear hierarchy emphasized by text weight and color contrast.
- **Palantir** — Utilizes a dark, high-contrast interface with an emphasis on data visualization and a controlled, almost austere aesthetic, communicating complex capabilities.
- **Anthropic** — Features a clean, minimalist dark aesthetic with a focus on core information, using typography and subtle grays to establish hierarchy.

## Quick Start

### Tailwind v4

For the master style configuration, review the main file `@src/styles/global.css`.
