#!/bin/bash

# ServDubai Configuration Update Helper
# This script helps you quickly update your configuration

echo "🔧 ServDubai Configuration Update Helper"
echo "========================================"
echo ""

# Check if config file exists
if [ ! -f "src/config/site.ts" ]; then
    echo "❌ Configuration file not found!"
    echo "Please make sure you're in the project root directory."
    exit 1
fi

echo "📋 What would you like to update?"
echo ""
echo "1. Business Information (name, phone, email, address)"
echo "2. Service Pricing"
echo "3. Team Members"
echo "4. Service Areas"
echo "5. Show current configuration"
echo "6. Create/Update .env.local file"
echo "7. Exit"
echo ""

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo ""
        echo "📊 Current Business Information:"
        echo "================================"
        grep -A 15 "business: {" src/config/site.ts | head -20
        echo ""
        echo "✏️  To update business info, edit: src/config/site.ts (lines 5-35)"
        echo "📱 Update phone, email, business name, and address in the 'business' section"
        ;;
    2)
        echo ""
        echo "💰 Current Pricing Configuration:"
        echo "================================="
        echo "NEW RESIDENT PACKAGES:"
        grep -A 20 "newResidentPackages:" src/config/site.ts | head -25
        echo ""
        echo "✏️  To update pricing, edit: src/config/site.ts (lines 60-200)"
        echo "💵 Update prices in the 'pricing' section"
        ;;
    3)
        echo ""
        echo "👥 Current Team Configuration:"
        echo "============================="
        echo "MANAGEMENT TEAM:"
        grep -A 15 "management:" src/config/site.ts | head -20
        echo ""
        echo "✏️  To update team info, edit: src/config/site.ts (lines 40-140)"
        echo "👤 Update names, positions, emails, and bios in the 'team' section"
        ;;
    4)
        echo ""
        echo "🌍 Current Service Areas:"
        echo "========================"
        grep -A 10 "emirates:" src/config/site.ts | head -15
        echo ""
        echo "✏️  To update service areas, edit: src/config/site.ts (lines 280-300)"
        echo "🗺️  Add/remove emirates and cities you serve"
        ;;
    5)
        echo ""
        echo "📄 Configuration File Structure:"
        echo "================================"
        echo "📁 Main Config: src/config/site.ts"
        echo "📁 Sensitive Data: .env.local (create from .env.example)"
        echo ""
        echo "📊 Config Sections:"
        echo "• business: Company info, contact details"
        echo "• team: Staff information and contacts"
        echo "• pricing: Service packages and prices"
        echo "• serviceAreas: Geographic coverage"
        echo "• website: SEO and meta information"
        echo "• operations: Time slots, response times"
        echo ""
        ;;
    6)
        echo ""
        echo "🔐 Environment File Setup:"
        echo "=========================="
        if [ -f ".env.local" ]; then
            echo "✅ .env.local already exists"
            echo "📝 Current variables:"
            grep -v "^#" .env.local | grep "=" | head -10
        else
            echo "📋 Creating .env.local from template..."
            cp .env.example .env.local
            echo "✅ .env.local created!"
        fi
        echo ""
        echo "🔧 Edit .env.local to configure:"
        echo "• SMTP_USER=your-email@gmail.com"
        echo "• SMTP_PASS=your-gmail-app-password"
        echo "• TO_EMAIL=where-bookings-go@yourdomain.com"
        echo "• SITE_URL=https://yourdomain.com"
        ;;
    7)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        ;;
esac

echo ""
echo "💡 Quick Tips:"
echo "==============" 
echo "1. Edit src/config/site.ts for business information"
echo "2. Edit .env.local for sensitive data (email passwords, etc.)"
echo "3. Test with: npm run dev"
echo "4. Build with: npm run build"
echo ""
echo "📖 See CONFIGURATION.md for detailed instructions"
