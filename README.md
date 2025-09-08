# ServDubai - Dubai's Premier Building Services

A modern Astro 4.x website for ServDubai, a Dubai-based property maintenance service company targeting new apartment residents and building management.

## 🏗️ Tech Stack

- **Framework**: Astro 4.x with React islands
- **Styling**: Tailwind CSS + shadcn/ui components  
- **Language**: TypeScript throughout
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Design**: Mobile-first responsive

## 🎨 Brand Identity

- **Company**: ServDubai
- **Tagline**: "Dubai's Premier Building Services"
- **Colors**: 
  - Primary Emerald (#10b981)
  - Secondary Teal (#0d9488) 
  - Accent Cyan (#06b6d4)
  - Text Dark Green (#059669)
- **Target**: New building residents, B2B building management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd servdubai

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # TypeScript & Astro checks
npm run lint         # ESLint
npm run format       # Prettier formatting
```

## 📁 Project Structure

```
servdubai/
├── src/
│   ├── pages/                 # Astro pages
│   │   ├── index.astro       # Landing page
│   │   ├── services.astro    # Services overview
│   │   ├── packages.astro    # AMC packages
│   │   ├── about.astro       # About page
│   │   ├── book.astro        # Booking form
│   │   └── contact.astro     # Contact page
│   ├── components/
│   │   ├── react/            # React islands
│   │   │   └── BookingForm.tsx
│   │   ├── astro/            # Astro components
│   │   │   ├── Navigation.astro
│   │   │   └── Footer.astro
│   │   └── ui/               # shadcn/ui components
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── layouts/
│   │   └── Layout.astro      # Base layout
│   ├── styles/
│   │   └── globals.css       # Global styles
│   └── utils/
│       └── cn.ts             # Utility functions
├── public/                   # Static assets
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## 🎯 Features

### Core Pages
- **Landing Page**: Hero section, services overview, trust indicators
- **Services**: Comprehensive service listings (plumbing, electrical, HVAC, etc.)
- **AMC Packages**: Tiered pricing (Basic, Premium, Enterprise)
- **About**: Company story, team, values
- **Booking**: Multi-step React form with validation
- **Contact**: Contact information, form, FAQ

### Interactive Components
- **Booking Form**: Multi-step form with React Hook Form + Zod validation
- **Navigation**: Responsive mobile menu
- **Animations**: Smooth transitions with CSS and potential Framer Motion integration

### Design System
- **Components**: Reusable shadcn/ui components
- **Colors**: Emerald/Teal/Cyan color scheme
- **Typography**: Inter font family
- **Layout**: Mobile-first responsive design

## 🛠️ Development

### Adding New Pages

1. Create new `.astro` file in `src/pages/`
2. Import and use the base layout
3. Add navigation links in `Navigation.astro`

### Adding React Components

1. Create component in `src/components/react/`
2. Use TypeScript for type safety
3. Import and use in Astro pages with `client:` directives

### Styling Guidelines

- Use Tailwind utility classes
- Follow the established color scheme
- Use component classes for repeated patterns
- Maintain mobile-first responsive design

## 🎨 Brand Guidelines

### Colors
```css
/* Primary - Emerald */
--primary: #10b981
--primary-50: #ecfdf5
--primary-600: #059669

/* Secondary - Teal */  
--secondary: #0d9488
--secondary-600: #0f766e

/* Accent - Cyan */
--accent: #06b6d4
--accent-600: #0891b2

/* Text */
--text: #059669
```

### Typography
- **Headings**: Bold, dark green (#059669)
- **Body**: Regular, gray tones
- **Accents**: Gradient text using primary colors

## 📱 Responsive Design

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+
- **Large**: 1400px+

Mobile-first approach with progressive enhancement.

## 🔧 Configuration

### Astro Config
- React integration enabled
- Tailwind CSS integration
- TypeScript support
- Static output for hosting

### Tailwind Config
- Custom color scheme
- shadcn/ui plugin
- Animation utilities
- Container settings

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The built site will be in the `dist/` folder, ready for deployment to any static hosting service.

### Hosting Options
- Vercel (recommended for Astro)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## 📞 Support

For questions about the codebase or ServDubai services:

- **Website**: [servdubai.com](https://servdubai.com)
- **Email**: info@servdubai.ae
- **Phone**: +971 50 123 4567

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for Dubai's building maintenance needs.
