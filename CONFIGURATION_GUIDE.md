# ServDubai Configuration Management Guide

## Overview
Your ServDubai website now has a centralized configuration system that makes it easy to update business information without touching code.

## Configuration Files

### 1. Business Configuration (`src/config/site.ts`)
This file contains ALL your business information that you'll want to update regularly:

**What's included:**
- ✅ Company contact details (phone, email, address)
- ✅ Business hours and service areas
- ✅ Team member information (management, technical, customer service)
- ✅ All pricing for AMC packages and resident services
- ✅ Service descriptions and features
- ✅ Social media links
- ✅ WhatsApp contact numbers

**How to update:**
1. Open `src/config/site.ts`
2. Find the section you want to update
3. Make your changes
4. Save the file
5. The website will automatically reflect your changes

### 2. Environment Variables (`.env.local`)
This file contains sensitive information that should never be shared:

**What's included:**
- 🔒 Email SMTP credentials
- 🔒 API keys
- 🔒 Secret tokens
- 🔒 Third-party service credentials

**How to update:**
1. Copy `.env.example` to `.env.local` if it doesn't exist
2. Fill in your actual credentials
3. Never commit this file to version control

## Common Updates

### Update Pricing
```typescript
// In src/config/site.ts, find the pricing section:
pricing: {
  amcPackages: {
    basic: { name: "Basic AMC", annual: 1200, quarterly: 300 },
    // Update these numbers as needed
  }
}
```

### Update Team Members
```typescript
// In src/config/site.ts, find the team section:
team: {
  management: [
    { name: "John Doe", role: "CEO", phone: "+971501234567" }
    // Add, remove, or update team members
  ]
}
```

### Update Contact Information
```typescript
// In src/config/site.ts, find the business section:
business: {
  name: "ServDubai",
  phone: "+971501234567", // Update main phone
  email: "info@servdubai.com", // Update main email
  // ... other contact details
}
```

## Helper Scripts

### Update Configuration (`./scripts/update-config.sh`)
Run this script for guided configuration updates:
```bash
chmod +x scripts/update-config.sh
./scripts/update-config.sh
```

## Testing Your Changes

1. **Development Server:**
   ```bash
   npm run dev
   ```
   Visit http://localhost:4322 to see your changes

2. **Build Test:**
   ```bash
   npm run build
   ```
   Ensures your changes don't break the build

3. **Deploy:**
   ```bash
   npm run deploy
   ```
   Pushes changes to production

## File Structure
```
src/
├── config/
│   └── site.ts          # 📝 Main configuration file
├── layouts/
│   └── Layout.astro     # Uses config for SEO and schema
├── components/
│   └── react/
│       └── BookingForm.tsx  # Uses config for pricing
└── utils/
    └── pricing.ts       # Uses config for calculations

.env.local               # 🔒 Sensitive credentials
.env.example            # 📋 Template for environment variables
```

## Key Benefits

✅ **Single Source of Truth**: All business info in one place  
✅ **No Code Changes**: Update business details without touching components  
✅ **Type Safety**: TypeScript ensures data consistency  
✅ **Automatic Updates**: Changes reflect across entire website  
✅ **Easy Maintenance**: Clear separation of business data and code  

## What Files Use the Configuration

- **Layout.astro**: Schema markup, meta tags, business info
- **BookingForm.tsx**: Pricing, team contacts, WhatsApp links
- **Pricing utilities**: Service descriptions and calculations
- **All components**: Automatically get updated business information

## Support

If you need to add new configuration options or have questions about updating the configuration, the system is designed to be easily extensible. Just add new properties to the `siteConfig` object in `site.ts` and they'll be available throughout the website.
