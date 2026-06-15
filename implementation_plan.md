# Implementation Plan - The Castleton Mansion Website

We will create a premium, modern, and minimal website for **The Castleton Mansion**, a luxury homestay in Rukmini Gaon, Guwahati. The design will draw inspiration from high-end real estate and resort layouts (like Spaciaz style), featuring rounded cards, bold typography, rich micro-interactions, and a cohesive warm ivory, gold, and navy color scheme.

## Design Details

- **Color Palette**:
  - Primary Navy: `#183A5A` (Sophisticated headers, highlights, primary buttons)
  - Luxury Gold: `#D4B06A` (Accent details, badges, active states)
  - Warm Ivory Background: `#F8F7F3` (Soft, premium backdrop)
  - Dark Text: `#111111`
  - Muted Text: `#666666`
- **Typography**: `Manrope` (imported from Google Fonts)
- **Border Radii**:
  - Cards: `30px`
  - Images: `28px`
  - Buttons: `999px` (Pill shape)
- **Animations & Transitions**: CSS custom animations, slide-ins, smooth scroll, hover lifts, glassmorphism filters for navbars and modals.

## Proposed Structure

We will create a multi-section, highly interactive single-page application (SPA style with tabs or smooth transitions) containing:
1. **Hero Section**: Large immersive imagery, brand tagline ("A Premium Luxury Stay"), and main CTAs.
2. **About Preview**: Elegant text layout highlighting the Guwahati location, local hospitality, and minimal illustration/images.
3. **Rooms Showcase**: Interactive cards for the 4 official room categories. Shows original vs discounted launch price, room features, and quick booking triggers.
4. **Amenities Grid**: Interactive modern icons (Wi-Fi, AC, Parking, Premium Bedding, Caretaker, Housekeeping, Breakfast, etc.) with hover effects.
5. **Gallery Slider/Lightbox**: A beautiful grid with a responsive modal lightbox to view high-quality images.
6. **Location Details**: Interactive map placeholder with rich typography, location features, nearby landmarks, and transport info.
7. **Contact / Interactive Booking Form**: Users can select dates, choose their preferred room, apply the 10% launch discount, calculate prices dynamically, and submit a booking request directly to WhatsApp or launch a Call CTA.

## File Structure

All files will be created in [castle on mansion](file:///c:/Users/chitr/Downloads/my%20websites/castle%20on%20mansion/):
- `index.html` - Primary HTML structure, layout, semantic tags, and content.
- `style.css` - Vanilla CSS with custom properties, typography, utility classes, and custom keyframe animations.
- `app.js` - Client-side logic for dynamic price calculation, room switching, image lightbox gallery, and custom form actions.

---

## Proposed Changes

### Web Application

#### [NEW] [index.html](file:///c:/Users/chitr/Downloads/my%20websites/castle%20on%20mansion/index.html)
- Main entry point.
- SEO tags, Meta tags, Google Font imports (Manrope), Lucide icons.
- Sections: Header/Nav, Hero, About, Rooms, Amenities, Gallery, Location, Booking Form, Footer.

#### [NEW] [style.css](file:///c:/Users/chitr/Downloads/my%20websites/castle%20on%20mansion/style.css)
- Custom variables mapping the requested colors and border radii.
- Modern CSS layout (Flexbox & CSS Grid).
- Responsive media queries.
- Micro-animations, button hover states, card lifting, fade-in transitions.

#### [NEW] [app.js](file:///c:/Users/chitr/Downloads/my%20websites/castle%20on%20mansion/app.js)
- Booking form dynamic total cost calculations (applying the 10% discount).
- Mobile menu toggle.
- Simple lightbox gallery viewer.
- WhatsApp message constructor using form inputs.

---

## Verification Plan

### Manual Verification
- Open `index.html` in the browser.
- Verify color contrast and aesthetic feel (Navy, Gold, Warm Ivory).
- Test layout responsiveness on mobile, tablet, and desktop views.
- Test functional components:
  - Room selection and booking cost calculator.
  - Form validation and WhatsApp link output formatting.
  - Lightbox media toggle.
  - Smooth scroll anchor links in navigation.
