# ServDubai Configuration Guide

This guide shows you exactly where to update all the key information in your ServDubai website.

## 🏢 Business Information

### Primary Contact Details
**File**: `src/layouts/Layout.astro` (lines 50-60)
```astro
"telephone": "+971501234567",
"email": "info@servdubai.com",
```

**File**: `.env.local` or Netlify Environment Variables
```env
BUSINESS_NAME=ServDubai
BUSINESS_PHONE=+971501234567
BUSINESS_EMAIL=info@servdubai.com
TO_EMAIL=bookings@servdubai.com  # Where booking emails go
FROM_EMAIL=info@servdubai.com   # Sender email
```

### WhatsApp Numbers
**Multiple locations - Search and replace these:**

1. **Layout (WhatsApp Widget)**: `src/layouts/Layout.astro` (line ~180)
```astro
href="https://wa.me/971501234567?text=Hi%20ServDubai!..."
```

2. **All Pages**: Search for `971501234567` and replace with your number
3. **Environment**: `.env.local`
```env
WHATSAPP_BUSINESS_PHONE=971501234567
```

## 💰 Pricing Configuration

### Service Prices
**File**: `src/utils/pricing.ts`

```typescript
// Base service prices (AED)
const servicePrices = {
  // New Resident Packages
  'move-in-ready': 800,           // ← Change these prices
  'first-month-free': 650,
  'new-building-special': 750,
  
  // AMC Packages (Annual)
  'basic': 1200,                  // ← Change these prices
  'premium': 2500,
  'family': 1800,
  
  // Individual Services
  'plumbing': 150,                // ← Change these prices
  'ac': 200,
  'painting': 180,
  'electrical': 120,
  'general': 100,
};
```

### Discount Rates
**File**: `.env.local` or `src/utils/pricing.ts`
```env
NEW_RESIDENT_DISCOUNT=0.30      # 30% discount for new residents
EMERGENCY_SURCHARGE=100         # AED 100 extra for emergency
AMC_DISCOUNT=0.20              # 20% discount for AMC
```

## 📧 Email Configuration

### SMTP Settings
**File**: `.env.local`
```env
SMTP_HOST=smtp.gmail.com        # Your email provider
SMTP_PORT=587
SMTP_USER=your-email@gmail.com  # Your business email
SMTP_PASS=your-app-password     # Gmail app password
```

### Email Templates & Recipients
**File**: `netlify/functions/resident-booking.ts` (lines 50-80)
```typescript
// Team notification email
const teamEmailOptions = {
  from: process.env.FROM_EMAIL || 'info@servdubai.com',
  to: process.env.TO_EMAIL || 'bookings@servdubai.com',  // ← Change this
  subject: `🏠 New Resident Booking: ${data.firstName} ${data.lastName}`,
```

**File**: `netlify/functions/amc-subscription.ts` (similar section)
**File**: `netlify/functions/general-contact.ts` (similar section)

## 🏗️ Service Packages & Names

### New Resident Packages
**File**: `src/components/react/BookingForm.tsx` (lines 150-160)
```typescript
{[
  { value: 'move-in-ready', label: 'Move-in Ready Package', price: 800 },
  { value: 'first-month-free', label: 'First Month Free', price: 650 },     // ← Change names & prices
  { value: 'new-building-special', label: 'New Building Special', price: 750 },
].map((pkg) => (
```

### AMC Packages
**File**: `src/components/react/BookingForm.tsx` (lines 180-190)
```typescript
{[
  { value: 'basic', label: 'Basic AMC', annual: 1200, quarterly: 300 },      // ← Change names & prices
  { value: 'premium', label: 'Premium AMC', annual: 2500, quarterly: 625 },
  { value: 'family', label: 'Family AMC', annual: 1800, quarterly: 450 },
].map((pkg) => (
```

### Individual Services
**File**: `src/components/react/BookingForm.tsx` (lines 200-210)
```html
<option value="plumbing">Plumbing Services - {formatPrice(150)}</option>     // ← Change names & prices
<option value="ac">AC Services - {formatPrice(200)}</option>
<option value="painting">Painting Services - {formatPrice(180)}</option>
<option value="electrical">Electrical Services - {formatPrice(120)}</option>
<option value="general">General Maintenance - {formatPrice(100)}</option>
```

## 👥 Team & Company Information

### About Page Content
**File**: `src/pages/about.astro`
- Update team member names
- Change company description
- Update experience years
- Modify service areas

### Contact Information
**File**: `src/pages/contact.astro`
- Update office addresses
- Change team email addresses
- Modify working hours
- Update service areas

## 🌐 Website Metadata

### Site Title & Description
**File**: `src/layouts/Layout.astro` (lines 15-20)
```astro
const {
  title = "ServDubai - Dubai's Premier Building Services",     // ← Change company name
  description = "Professional building maintenance and property services...",  // ← Update description
```

### Schema.org Business Data
**File**: `src/layouts/Layout.astro` (lines 30-70)
```typescript
const organizationSchema = {
  "@type": "LocalBusiness",
  "name": "ServDubai",                    // ← Change business name
  "description": "Professional building maintenance...",  // ← Update description
  "telephone": "+971501234567",           // ← Change phone
  "email": "info@servdubai.com",         // ← Change email
```

## 🗺️ Location & Service Areas

### Service Coverage
**File**: `src/utils/pricing.ts` (emirates list)
```typescript
export const emirates = [
  { value: 'dubai', label: 'Dubai' },
  { value: 'sharjah', label: 'Sharjah' },    // ← Add/remove emirates you serve
  { value: 'ajman', label: 'Ajman' },
  // Add more emirates as needed
];
```

### Geographic Schema
**File**: `src/layouts/Layout.astro` (lines 60-70)
```typescript
"address": {
  "@type": "PostalAddress",
  "addressCountry": "AE",
  "addressRegion": "Dubai",              // ← Change your main region
  "addressLocality": "Dubai"             // ← Change your city
},
"geo": {
  "@type": "GeoCoordinates",
  "latitude": "25.2048",                 // ← Update coordinates
  "longitude": "55.2708"
},
```

## 🎨 Branding & Visual Elements

### Logo & Images
**Files to replace in `/public/`:**
- `favicon.svg` - Website icon
- `og-image.jpg` - Social media preview image
- `apple-touch-icon.png` - iOS app icon
- `icon-*.png` - PWA app icons

### Color Scheme
**File**: `tailwind.config.mjs`
```javascript
colors: {
  primary: {
    50: '#f0fdfa',     // ← Change brand colors
    500: '#14b8a6',    // ← Main brand color
    600: '#0d9488',    // ← Darker brand color
  }
}
```

## 📱 App Configuration

### PWA App Name
**File**: `public/manifest.json`
```json
{
  "name": "ServDubai - Building Services",      // ← Change app name
  "short_name": "ServDubai",                   // ← Change short name
  "description": "Professional building maintenance...",  // ← Update description
}
```

## 🔍 SEO Configuration

### Sitemap URLs
**File**: `public/sitemap.xml`
- Update domain from `servdubai.netlify.app` to your domain
- Add/remove pages as needed

### Robots.txt
**File**: `public/robots.txt`
- Update sitemap URL to your domain

## 🚀 Quick Update Checklist

### Essential Updates (Must Do):
- [ ] Phone numbers (search: `971501234567`)
- [ ] Email addresses (search: `@servdubai.com`)
- [ ] Business name (search: `ServDubai`)
- [ ] Pricing in `src/utils/pricing.ts`
- [ ] Environment variables in `.env.local`

### Content Updates:
- [ ] Service package names and descriptions
- [ ] Team information in About page
- [ ] Contact information and addresses
- [ ] Service areas and coverage

### Technical Updates:
- [ ] Domain in sitemap.xml
- [ ] SMTP email credentials
- [ ] Logo and brand images
- [ ] Color scheme if needed

## 🔧 Testing After Updates

1. **Test all forms** - Make sure they submit correctly
2. **Check email notifications** - Verify you receive bookings
3. **Test WhatsApp links** - Ensure they open with correct number
4. **Verify pricing displays** - Check all prices show correctly
5. **Test on mobile** - Ensure responsive design works

## 📝 Common File Patterns

To find all instances of something, search for:
- Phone numbers: `971501234567` or `+971 50 123 4567`
- Emails: `@servdubai.com`
- Business name: `ServDubai`
- Prices: Look in `pricing.ts` and `BookingForm.tsx`

Use VS Code's "Find and Replace" (Cmd+Shift+F) to update multiple files at once.

---

**Pro Tip**: Always test your changes locally with `npm run dev` before deploying to production!
