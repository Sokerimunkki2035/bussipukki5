# Bussipukki Design Guidelines

## Design Approach
**Reference-Based with Festive Gaming Theme**: Drawing inspiration from Nintendo's playful aesthetics combined with modern e-commerce patterns (Shopify/Etsy), all wrapped in a distinctive Christmas theme that celebrates the bus driver's personality and community presence.

## Core Design Elements

### A. Color Palette

**Christmas Festive Scheme**:
- **Primary Red**: 0 84% 60% (bright, cheerful red for CTAs and primary elements)
- **Forest Green**: 140 45% 35% (deep green for navigation, headers)
- **Cream White**: 45 30% 96% (warm white for backgrounds)
- **Gold Accent**: 45 95% 55% (metallic gold for highlights, badges, success states)
- **Dark Text**: 0 0% 15% (almost black for readable text)

**Dark Mode** (if needed):
- Background: 140 25% 10% (dark green-tinted)
- Cards: 140 20% 15%
- Text: 0 0% 95%

### B. Typography

**Font System**:
- **Headings**: 'Fredoka' or 'Righteous' (playful, rounded, friendly - perfect for games)
- **Body**: 'Inter' or 'Open Sans' (clean, readable)
- **Accent/Special**: 'Mountains of Christmas' for brand elements (festive touch)

**Scale**:
- Hero Title: text-5xl md:text-7xl font-bold
- Section Headers: text-3xl md:text-4xl font-bold
- Card Titles: text-xl md:text-2xl font-semibold
- Body: text-base md:text-lg
- Small: text-sm

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16 for consistency
- Component padding: p-4 to p-8
- Section spacing: py-12 md:py-16 lg:py-20
- Card gaps: gap-6 md:gap-8
- Container: max-w-7xl mx-auto px-4

**Grid Patterns**:
- Game cards: grid-cols-1 md:grid-cols-2 gap-8
- Product grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6
- Features: grid-cols-1 md:grid-cols-3 gap-8

### D. Component Library

**Navigation**:
- Sticky header with festive green background
- Logo with Christmas theme (bus + reindeer antlers icon)
- Clear navigation: Etusivu | Pelit | TikTok Arvaus | Kauppa
- Mobile: Hamburger menu with slide-in drawer

**Hero Section**:
- Full-width festive banner (80vh) with bus/Christmas imagery
- Large playful headline about the bus driver
- Subtle snow animation or twinkling lights effect (CSS only)
- Dual CTAs: "Pelaa Pelejä" (red) + "Selaa Kauppaa" (gold outline)

**Game Cards**:
- Rounded cards (rounded-2xl) with subtle shadows
- Hover effect: lift and glow (transform + shadow)
- Icon/preview image at top
- Title, description, "Pelaa" button
- Background: gradient from cream to light gold

**TikTok Live Section**:
- Prominent card with live indicator (pulsing red dot when active)
- Simple number input form for guesses
- Name/username field
- Festive "Lähetä Arvaus" button
- Real-time guess counter display

**Product Cards** (Mock Store):
- Image with overlay on hover
- Product name, price in euros
- "Lisää Koriin" button (disabled with note about mock)
- Badge: "Esimerkkituote" (gold badge)

**Admin Dashboard** (for viewing guesses):
- Clean table layout
- Filters: show all, by timestamp
- Columns: Nimi, Arvaus, Aika
- Export option (visual only)

**Footer**:
- Rich footer with sections: Pelit, Info, Seuraa
- Social media links (TikTok prominent)
- Contact info, copyright
- Christmas-themed decorative elements

### E. Visual Elements

**Decorative Touches**:
- Subtle snowflake patterns in backgrounds (CSS or SVG patterns)
- Gift box icons for product categories
- Bus silhouettes with Santa hat as dividers
- Candy cane borders (thin red/white stripes) for festive sections

**Buttons**:
- Primary: Red background, white text, rounded-full, shadow-lg
- Secondary: Gold border, gold text, rounded-full, transparent bg with backdrop-blur
- States: Hover lifts (translate-y-1), active scales (scale-95)

**Cards & Containers**:
- Soft shadows: shadow-lg with warm tint
- Rounded corners: rounded-2xl for main cards, rounded-xl for smaller
- Border accents: gold top border (border-t-4) on feature cards

### F. Images

**Hero Image**: Full-width festive image featuring a decorated bus with Christmas lights, possibly driver in Santa hat - warm, inviting, professional yet playful

**Game Section**: Icon-based illustrations or simple preview images for each game (puzzle pieces, nuts)

**Product Images**: Mock Printful products - t-shirts, hoodies, mugs with "Bussipukki" branding and Christmas designs

**Background Patterns**: Subtle festive patterns (snowflakes, dots) in cream/gold tones, never overwhelming

### G. Interactions (Minimal)

- Smooth page scrolling behavior
- Gentle hover transforms (scale-105 on cards, translate-y-1 on buttons)
- Loading states with festive spinner (bus icon rotating)
- Success animations: confetti burst (canvas) when guess submitted
- NO complex scroll-triggered animations

### H. Responsive Behavior

**Mobile-First Strategy**:
- Stack all game/product grids to single column on mobile
- Simplified navigation with drawer menu
- Touch-friendly button sizes (min-h-12)
- Reduced padding/spacing on small screens (p-4 vs p-8)
- Hero text scales down dramatically (text-3xl vs text-7xl)

**Breakpoints**:
- Mobile: base styles
- Tablet: md: (768px+)
- Desktop: lg: (1024px+)
- Wide: xl: (1280px+)

This festive, playful design celebrates the bus driver's personality while providing clear paths to games, TikTok interaction, and shopping - all wrapped in Christmas cheer that matches Pori's winter spirit.