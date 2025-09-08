# ServDubai Deployment Guide

This guide will help you deploy the ServDubai website to production.

## Prerequisites

- Node.js 18+ installed
- Netlify account
- Gmail account for SMTP (or other email provider)
- WhatsApp Business account (optional but recommended)

## Environment Variables Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure the following variables in `.env.local`:**

   ```env
   # Email Configuration (Required)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-business-email@gmail.com
   SMTP_PASS=your-gmail-app-password
   FROM_EMAIL=info@servdubai.com
   TO_EMAIL=bookings@servdubai.com

   # WhatsApp Business (Optional)
   WHATSAPP_BUSINESS_PHONE=971501234567
   WHATSAPP_BUSINESS_TOKEN=your-whatsapp-business-token

   # Business Information
   BUSINESS_NAME=ServDubai
   BUSINESS_PHONE=+971501234567
   BUSINESS_EMAIL=info@servdubai.com

   # Pricing Configuration
   NEW_RESIDENT_DISCOUNT=0.30
   EMERGENCY_SURCHARGE=100
   AMC_DISCOUNT=0.20

   # Production Settings
   NODE_ENV=production
   SITE_URL=https://your-domain.com
   ```

## Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings > Security > App passwords
3. Generate an app password for "Mail"
4. Use this password in `SMTP_PASS` (not your regular Gmail password)

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Test backend functions locally:**
   ```bash
   netlify dev
   ```

## Netlify Deployment

### Option 1: Deploy via Git (Recommended)

1. **Push to GitHub/GitLab:**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Set environment variables in Netlify:**
   - Go to Site settings > Environment variables
   - Add all variables from your `.env.local` file

### Option 2: Manual Deploy

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

## Domain Configuration

1. **Custom Domain (Optional):**
   - In Netlify dashboard: Site settings > Domain management
   - Add your custom domain
   - Configure DNS records as instructed

2. **HTTPS:**
   - Automatically enabled by Netlify
   - Free SSL certificate included

## Post-Deployment Checklist

### 1. Test All Forms
- [ ] New Resident booking form
- [ ] AMC subscription form
- [ ] General contact form
- [ ] Emergency booking form

### 2. Verify Email Notifications
- [ ] Check booking confirmations are sent
- [ ] Verify team notifications work
- [ ] Test email templates render correctly

### 3. WhatsApp Integration
- [ ] Test WhatsApp links from forms
- [ ] Verify phone numbers are correct
- [ ] Check message templates

### 4. Mobile Testing
- [ ] Test on various mobile devices
- [ ] Verify PWA installation works
- [ ] Check offline functionality

### 5. SEO Verification
- [ ] Submit sitemap to Google Search Console
- [ ] Verify meta tags and schema markup
- [ ] Test page load speeds

## Monitoring and Analytics

### Google Analytics Setup
1. Create Google Analytics 4 property
2. Add tracking code to `src/layouts/Layout.astro`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

### Performance Monitoring
- Use Netlify Analytics for basic metrics
- Consider adding Lighthouse CI for automated performance testing
- Monitor Core Web Vitals

## Maintenance

### Regular Updates
1. **Monthly:**
   - Update dependencies: `npm update`
   - Review and update content
   - Check broken links

2. **Quarterly:**
   - Review pricing in `src/utils/pricing.ts`
   - Update service packages
   - Review and optimize images

### Backup Strategy
- Code is backed up in Git repository
- Form submissions are sent via email
- Consider database backup for future data storage

## Troubleshooting

### Common Issues

1. **Forms not submitting:**
   - Check environment variables in Netlify
   - Verify SMTP credentials
   - Check Netlify Functions logs

2. **Email not sending:**
   - Verify Gmail app password
   - Check SMTP settings
   - Review email provider limits

3. **Mobile issues:**
   - Test on actual devices
   - Check PWA manifest
   - Verify service worker registration

### Support Resources
- [Netlify Documentation](https://docs.netlify.com/)
- [Astro Documentation](https://docs.astro.build/)
- [React Hook Form Documentation](https://react-hook-form.com/)

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files to Git
   - Use Netlify's environment variable management
   - Regularly rotate sensitive credentials

2. **Form Validation:**
   - Backend validation is implemented
   - Rate limiting should be added for production
   - Consider adding CAPTCHA for high-traffic sites

3. **Content Security:**
   - Review and update content regularly
   - Monitor for spam submissions
   - Implement proper error handling

## Future Enhancements

### Planned Features
1. **Customer Portal:**
   - Booking history
   - Service tracking
   - Payment management

2. **Advanced Analytics:**
   - Conversion tracking
   - Customer behavior analysis
   - Service performance metrics

3. **Automation:**
   - Automated follow-ups
   - Reminder notifications
   - Invoice generation

### Technical Improvements
1. **Database Integration:**
   - Customer data storage
   - Booking management system
   - Service history tracking

2. **Payment Integration:**
   - Online payment processing
   - Subscription management
   - Invoice automation

3. **CRM Integration:**
   - Customer relationship management
   - Sales pipeline tracking
   - Communication history

## Contact for Support

For deployment support or technical issues:
- Email: developer@servdubai.com
- Documentation: This README.md
- Issue Tracker: GitHub repository issues

---

**Note:** This deployment guide assumes a production environment. For staging or testing deployments, adjust environment variables and domains accordingly.
