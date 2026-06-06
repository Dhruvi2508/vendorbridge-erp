---
name: VendorBridge Design System
colors:
  surface: '#faf9f9'
  surface-dim: '#dadada'
  surface-bright: '#faf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#efeeed'
  surface-container-high: '#e9e8e8'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4d4635'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f0f0'
  outline: '#7f7663'
  outline-variant: '#d0c5af'
  surface-tint: '#745b00'
  primary: '#745b00'
  on-primary: '#ffffff'
  primary-container: '#f3ca4a'
  on-primary-container: '#6b5500'
  inverse-primary: '#ebc243'
  secondary: '#84540f'
  on-secondary: '#ffffff'
  secondary-container: '#fdbd70'
  on-secondary-container: '#784a03'
  tertiary: '#5f5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#d0cece'
  on-tertiary-container: '#585857'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe08a'
  primary-fixed-dim: '#ebc243'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574400'
  secondary-fixed: '#ffddb9'
  secondary-fixed-dim: '#faba6e'
  on-secondary-fixed: '#2b1700'
  on-secondary-fixed-variant: '#663e00'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#faf9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e3e2e2'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  container-margin: 32px
  gutter: 24px
---

## Brand & Style
The design system is engineered for a high-stakes enterprise ERP environment where clarity, reliability, and executive-level sophistication are paramount. The brand personality is authoritative yet modern, bridging the gap between traditional industrial procurement and cutting-edge SaaS efficiency.

The design style follows a **Modern Corporate** aesthetic, drawing inspiration from high-performance fintech platforms. It utilizes a structured "Information First" approach:
- **High Density:** Information is packed efficiently for power users, but balanced with intentional whitespace to prevent cognitive overload.
- **Card-Based Architecture:** Logic is grouped into defined containers to manage complex vendor data.
- **Precision:** Fine lines, subtle shadows, and a rigorous grid system convey a sense of stability and accuracy.
- **Functional Accents:** Vibrant primary yellows are used sparingly as high-visibility catalysts for action, while deep golds provide a premium, grounded contrast.

## Colors
The palette is built on a foundation of industrial grays, punctuated by a sophisticated "Gold Standard" duo. 

- **Primary Yellow (#F3CA4A):** Reserved for high-priority CTAs, active states, and critical highlights. It represents energy and efficiency.
- **Dark Gold (#744700):** Used for sophisticated accents, iconography in premium tiers, and deep-contrast elements that require more gravity than the primary yellow.
- **Neutral Scale:** The background uses a cool, tinted gray (#F3F6F4) to reduce eye strain during long procurement cycles. Text scales from the deep Dark Gray (#444444) for primary readability to Medium Gray (#999999) for metadata and borders.
- **Semantic Colors:** Status badges (Success, Error, Warning) utilize highly legible, slightly desaturated tones to fit the professional ERP context without appearing toy-like.

## Typography
This design system employs **Hanken Grotesk** as the primary typeface. Its sharp, contemporary geometry provides the "tech-forward" feel necessary for a modern ERP while maintaining exceptional legibility in data-heavy tables.

- **Headlines:** Use a tighter letter-spacing and heavier weights to create a strong visual anchor for page sections.
- **Body:** Sized for long-form reading of contracts and vendor notes. The 16px base ensures accessibility.
- **Labels:** **JetBrains Mono** is introduced for tabular data, SKU numbers, and status badges. The monospaced nature ensures that numerical values align perfectly in columns, facilitating quick financial audits.

## Layout & Spacing
The layout uses a **12-column fluid grid** for the main content area, with a fixed side navigation bar (280px). 

- **The 4px Rule:** All spacing increments are multiples of 4px. Use `md` (16px) for standard internal card padding and `lg` (24px) for spacing between major layout components.
- **Density Management:** For data tables, a "Condensed" mode is available using `sm` (8px) vertical padding, while standard dashboard views use `md` (16px).
- **Responsive Behavior:** On tablet, margins reduce to 24px and the side navigation collapses into an icon-only rail. On mobile, the grid shifts to a single column with 16px side margins.

## Elevation & Depth
Depth is signaled through **Tonal Layering** and soft, sophisticated shadows that mimic natural light.

- **Level 0 (Background):** #F3F6F4. The lowest layer.
- **Level 1 (Cards/Surface):** Pure White (#FFFFFF). This is the primary surface for content. It features a subtle 1px border (#E5E7EB) and a very soft shadow (0px 4px 12px rgba(0,0,0,0.03)).
- **Level 2 (Hover/Active):** Surfaces lift slightly using a more pronounced shadow (0px 8px 24px rgba(0,0,0,0.06)).
- **Level 3 (Modals/Popovers):** These use high-contrast shadows to separate from the background, often accompanied by a 20% opacity neutral-dark backdrop blur.

## Shapes
The shape language is "Rounded-Soft." It avoids the clinical feel of sharp corners while remaining professional.

- **Standard Elements:** Buttons, Input fields, and Small Cards use a `0.5rem` (8px) radius.
- **Large Containers:** Dashboard widgets and main content areas use `1rem` (16px) for a modern, approachable look.
- **Status Badges:** Use a full pill-shape (999px) to distinguish them from interactive buttons.

## Components
- **Buttons:** Primary buttons use the Primary Yellow (#F3CA4A) with Dark Gray text. Secondary buttons use a transparent background with a Medium Gray border. Action buttons feature a slight 2px bottom "border-shadow" to give a tactile feel.
- **Data Tables:** These are the heart of the system. Headers are Sticky, using a light gray background with uppercase `label-sm` typography. Rows feature a hover state of #F9FAFB.
- **Input Fields:** Use a 1px border (#999999). On focus, the border transitions to Dark Gold (#744700) with a subtle yellow outer glow.
- **Chips & Badges:** Categorical chips use low-saturation versions of semantic colors. Vendor status (e.g., "Verified") uses a Dark Gold outline with a small checkmark icon.
- **Cards:** All cards must have a 16px internal padding. Title sections in cards should be separated by a subtle 1px divider.
- **Charts:** Use a custom-curated palette starting with Primary Yellow, then moving to Deep Teal, Slate, and Gold to ensure high-contrast data visualization.