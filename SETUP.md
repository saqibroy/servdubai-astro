# ServDubai Project Setup Instructions

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm package manager
- Git (optional, for version control)

### Step 1: Install Dependencies

Navigate to the project directory and install all required dependencies:

```bash
cd servdubai
npm install
```

This will install:
- Astro 4.x framework
- React and React DOM
- TypeScript
- Tailwind CSS and plugins
- shadcn/ui components
- Framer Motion
- React Hook Form + Zod
- Lucide React icons
- Development tools (ESLint, Prettier)

### Step 2: Start Development Server

```bash
npm run dev
```

The development server will start at `http://localhost:4321`

### Step 3: Verify Installation

Open your browser and navigate to `http://localhost:4321`. You should see:
- ServDubai landing page with emerald/teal branding
- Responsive navigation menu
- Hero section with Dubai skyline illustration
- Services overview cards
- Call-to-action sections

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:4321)
npm run start        # Alias for dev

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality  
npm run check        # TypeScript & Astro checks
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking
```

## 🔧 Configuration

### Astro Configuration
The `astro.config.mjs` includes:
- React integration for interactive components
- Tailwind CSS integration
- TypeScript support
- Static site generation

### Tailwind Configuration
Custom theme in `tailwind.config.mjs`:
- ServDubai brand colors (emerald, teal, cyan)
- shadcn/ui compatibility
- Custom animations
- Responsive breakpoints

### TypeScript Configuration
Strict TypeScript setup with:
- Path aliases for cleaner imports
- React JSX support
- Astro-specific types

## 🎨 Brand System

### Colors
```css
Primary Emerald: #10b981
Secondary Teal: #0d9488  
Accent Cyan: #06b6d4
Text Dark Green: #059669
```

### Components
- Use shadcn/ui components in `src/components/ui/`
- React interactive components in `src/components/react/`
- Astro static components in `src/components/astro/`

## 📱 Testing Pages

Visit these pages to verify everything works:

1. **Home** (`/`) - Landing page with hero and services
2. **Services** (`/services`) - Complete service listings  
3. **AMC Packages** (`/packages`) - Pricing tiers
4. **About** (`/about`) - Company information
5. **Booking** (`/book`) - Multi-step React form
6. **Contact** (`/contact`) - Contact information and form

## 🛠️ Development Guidelines

### Adding New Pages
1. Create `.astro` file in `src/pages/`
2. Use the Layout component
3. Follow mobile-first responsive design
4. Add navigation links if needed

### React Components
1. Create in `src/components/react/`
2. Use TypeScript interfaces
3. Import in Astro with client directives
4. Follow React best practices

### Styling
1. Use Tailwind utility classes
2. Follow the brand color scheme
3. Use established component patterns
4. Test on mobile, tablet, and desktop

## 🐛 Troubleshooting

### Common Issues

**1. Dependencies not installing**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. TypeScript errors**
```bash
# Run type checking
npm run check
npm run type-check
```

**3. Build failing**
```bash
# Check for linting issues
npm run lint
npm run format
```

**4. Port already in use**
```bash
# Kill process on port 4321
lsof -ti:4321 | xargs kill -9
# Or use different port
npm run dev -- --port 3000
```

### Performance Tips
- Images are placeholder SVGs for now - replace with optimized images
- React components use client-side hydration only where needed
- Static pages load fast with Astro's static generation

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

Output will be in `dist/` folder ready for static hosting.

### Hosting Options
- **Vercel** (recommended): Zero-config Astro deployment
- **Netlify**: Drag and drop or Git integration  
- **AWS S3 + CloudFront**: Custom domain and CDN
- **GitHub Pages**: Free hosting for public repos

### Environment Variables
Create `.env` file for:
```
PUBLIC_SITE_URL=https://yourdomain.com
```

## 📞 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify Node.js version (18+)
3. Clear cache and reinstall dependencies
4. Check the GitHub issues or documentation

For ServDubai business inquiries:
- Email: info@servdubai.ae  
- Phone: +971 50 123 4567

## ✅ Success Checklist

- [ ] Dependencies installed successfully
- [ ] Development server running on localhost:4321
- [ ] All pages load without errors
- [ ] Navigation menu works on mobile and desktop
- [ ] Booking form displays (React component)
- [ ] Contact form submits successfully
- [ ] Responsive design works across devices
- [ ] Brand colors and styling applied correctly
- [ ] TypeScript compiles without errors
- [ ] Production build completes successfully

## 🎯 Next Steps

Once setup is complete, you can:

1. **Customize Content**: Update copy, images, and contact information
2. **Add Features**: Implement backend API, payment processing, real maps
3. **SEO Optimization**: Add meta tags, structured data, sitemap
4. **Performance**: Optimize images, implement caching strategies
5. **Analytics**: Add Google Analytics or other tracking
6. **Testing**: Set up automated testing for forms and functionality

The foundation is now ready for customization and deployment!
