#!/bin/bash

# ServDubai Quick Update Script
# This script helps you quickly find and update common values

echo "🔍 ServDubai Configuration Finder"
echo "=================================="

# Function to search for patterns
search_pattern() {
    echo ""
    echo "📍 Searching for: $1"
    echo "Files containing this pattern:"
    grep -r "$1" src/ netlify/ public/ --include="*.ts" --include="*.tsx" --include="*.astro" --include="*.json" --include="*.xml" | head -10
}

# Function to show file locations
show_locations() {
    echo ""
    echo "📁 Key Files to Update:"
    echo "======================="
    echo "💰 PRICING: src/utils/pricing.ts"
    echo "📧 EMAIL: .env.local (create from .env.example)"
    echo "🏢 BUSINESS INFO: src/layouts/Layout.astro"
    echo "📱 WHATSAPP: Multiple files (search for phone number)"
    echo "📦 PACKAGES: src/components/react/BookingForm.tsx"
    echo "🌐 DOMAIN: public/sitemap.xml, public/robots.txt"
}

# Main menu
echo ""
echo "What would you like to find?"
echo "1. Phone numbers (971501234567)"
echo "2. Email addresses (@servdubai.com)"
echo "3. Business name (ServDubai)"
echo "4. Pricing values"
echo "5. Show all key file locations"
echo "6. Exit"

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        search_pattern "971501234567"
        search_pattern "+971 50 123 4567"
        ;;
    2)
        search_pattern "@servdubai.com"
        search_pattern "info@servdubai"
        ;;
    3)
        search_pattern "ServDubai"
        search_pattern "\"name\": \"ServDubai\""
        ;;
    4)
        echo ""
        echo "💰 Current Pricing (in src/utils/pricing.ts):"
        echo "============================================="
        echo "NEW RESIDENT PACKAGES:"
        grep -A 5 "newResident:" src/utils/pricing.ts
        echo ""
        echo "AMC PACKAGES:"
        grep -A 7 "amc:" src/utils/pricing.ts
        echo ""
        echo "INDIVIDUAL SERVICES:"
        grep -A 8 "individual:" src/utils/pricing.ts
        ;;
    5)
        show_locations
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        ;;
esac

echo ""
echo "💡 TIP: Use VS Code's Find & Replace (Cmd+Shift+F) to update multiple files at once!"
echo "📖 See CONFIGURATION.md for detailed instructions"
