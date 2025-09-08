// ServDubai Configuration File
// Update this file to change all business information across the website

export const siteConfig = {
  // ============================================================================
  // BUSINESS INFORMATION
  // ============================================================================
  business: {
    name: "ServDubai",
    tagline: "Dubai's Premier Building Services",
    description: "Professional building maintenance and property services for new apartment residents in Dubai. AMC packages, emergency repairs, and comprehensive building solutions.",
    
    // Contact Information
    phone: "+971552418446",
    phoneDisplay: "+971 55 241 8446",
    whatsappNumber: "971552418446", // Without + and spaces
    email: "info@servdubai.com",
    website: "https://servdubai.netlify.app",
    
    // Address
    address: {
      street: "Business Bay",
      city: "Dubai",
      country: "United Arab Emirates",
      countryCode: "AE",
      region: "Dubai",
      coordinates: {
        latitude: "25.2048",
        longitude: "55.2708"
      }
    },
    
    // Business Hours
    hours: {
      display: "24/7 Emergency Service Available",
      emergency: "24/7",
      regular: "Mo-Su 08:00-20:00",
      timezone: "Asia/Dubai"
    },
    
    // Service Areas
    serviceAreas: [
      "Dubai Marina", "Downtown Dubai", "Business Bay", "DIFC", 
      "JBR", "Palm Jumeirah", "Dubai Hills", "City Walk",
      "Al Barsha", "Jumeirah", "Deira", "Bur Dubai"
    ]
  },

  // ============================================================================
  // TEAM INFORMATION
  // ============================================================================
  team: {
    // Management Team
    management: [
      {
        name: "Aqib Sohail",
        position: "General Manager",
        email: "aqib@servdubai.com",
        phone: "+971552418446",
        bio: "15+ years experience in Dubai property management",
        image: "/team/ahmed.jpg",
        specialties: ["Property Management", "Team Leadership", "Customer Relations"]
      },
      {
        name: "Sarah Johnson", 
        position: "Operations Manager",
        email: "sarah@servdubai.com",
        phone: "+971501234568",
        bio: "Expert in building maintenance operations and quality control",
        image: "/team/sarah.jpg",
        specialties: ["Operations", "Quality Control", "Process Management"]
      }
    ],
    
    // Technical Team Leads
    technicalLeads: [
      {
        name: "Hassan Ali",
        position: "Senior HVAC Technician",
        email: "hassan@servdubai.com",
        phone: "+971501234569",
        certifications: ["HVAC Certified", "Refrigeration Expert"],
        experience: "12 years",
        specialties: ["AC Installation", "Maintenance", "Emergency Repairs"]
      },
      {
        name: "Mohammad Rashid",
        position: "Master Electrician", 
        email: "mohammad@servdubai.com",
        phone: "+971501234570",
        certifications: ["Licensed Electrician", "Safety Inspector"],
        experience: "10 years",
        specialties: ["Electrical Installation", "Safety Systems", "Smart Home"]
      },
      {
        name: "Priya Sharma",
        position: "Plumbing Supervisor",
        email: "priya@servdubai.com", 
        phone: "+971501234571",
        certifications: ["Master Plumber", "Water Systems Expert"],
        experience: "8 years",
        specialties: ["Plumbing Systems", "Water Treatment", "Leak Detection"]
      }
    ],
    
    // Customer Service
    customerService: [
      {
        name: "Fatima Al-Zahra",
        position: "Customer Service Manager",
        email: "support@servdubai.com",
        phone: "+971501234572",
        languages: ["English", "Arabic", "Hindi"],
        availability: "24/7"
      },
      {
        name: "John Martinez",
        position: "Booking Coordinator", 
        email: "bookings@servdubai.com",
        phone: "+971501234573",
        languages: ["English", "Spanish"],
        availability: "8 AM - 8 PM"
      }
    ]
  },

  // ============================================================================
  // SERVICE PRICING
  // ============================================================================
  pricing: {
    // New Resident Packages
    newResidentPackages: {
      "move-in-ready": {
        price: 800,
        name: "Move-in Ready Package",
        description: "Complete move-in preparation including deep cleaning, basic repairs, and safety checks",
        features: ["Deep cleaning", "Basic repairs", "Safety inspection", "AC check", "Plumbing check"],
        duration: "4-6 hours",
        warranty: "30 days"
      },
      "first-month-free": {
        price: 650,
        name: "First Month Free",
        description: "First month free maintenance service for new residents",
        features: ["One free service call", "Basic maintenance", "Priority booking"],
        duration: "2-4 hours", 
        warranty: "30 days"
      },
      "new-building-special": {
        price: 750,
        name: "New Building Special",
        description: "Special package for new building residents with comprehensive setup",
        features: ["Building inspection", "Setup assistance", "Maintenance planning"],
        duration: "3-5 hours",
        warranty: "45 days"
      }
    },
    
    // AMC Packages
    amcPackages: {
      "basic": {
        annual: 1200,
        quarterly: 300,
        name: "Basic AMC",
        description: "Essential maintenance coverage for your property",
        features: ["Quarterly visits", "Basic repairs", "Emergency support", "Priority booking"],
        serviceFrequency: "Quarterly",
        emergencyResponse: "Same day"
      },
      "premium": {
        annual: 2500,
        quarterly: 625,
        name: "Premium AMC", 
        description: "Comprehensive maintenance with priority service",
        features: ["Monthly visits", "All repairs included", "24/7 emergency", "Premium support"],
        serviceFrequency: "Monthly",
        emergencyResponse: "2 hours"
      },
      "family": {
        annual: 1800,
        quarterly: 450,
        name: "Family AMC",
        description: "Perfect for families with comprehensive home care",
        features: ["Bi-monthly visits", "Family-focused services", "Child-safe materials", "Flexible scheduling"],
        serviceFrequency: "Bi-monthly", 
        emergencyResponse: "4 hours"
      }
    },
    
    // Individual Services
    individualServices: {
      "plumbing": {
        price: 150,
        name: "Plumbing Services",
        description: "Professional plumbing repairs and installations",
        includes: ["Leak repairs", "Pipe installation", "Drain cleaning", "Basic inspection"]
      },
      "ac": {
        price: 200,
        name: "AC Services", 
        description: "Air conditioning maintenance and repair",
        includes: ["AC cleaning", "Filter replacement", "Gas refilling", "Performance check"]
      },
      "painting": {
        price: 180,
        name: "Painting Services",
        description: "Professional interior and exterior painting",
        includes: ["Wall preparation", "Premium paint", "Clean finish", "Touch-up warranty"]
      },
      "electrical": {
        price: 120,
        name: "Electrical Services",
        description: "Electrical repairs and installations", 
        includes: ["Wiring repairs", "Switch/outlet installation", "Safety inspection", "Circuit testing"]
      },
      "general": {
        price: 100,
        name: "General Maintenance",
        description: "Basic maintenance and repair services",
        includes: ["Minor repairs", "Maintenance check", "Basic cleaning", "Preventive care"]
      }
    },
    
    // Pricing Rules
    discounts: {
      newResident: 0.30, // 30% discount for new residents
      amc: 0.20,         // 20% discount for AMC customers
      referral: 0.10     // 10% discount for referrals
    },
    
    surcharges: {
      emergency: 100,    // AED 100 for same-day emergency service
      weekend: 50,       // AED 50 for weekend service
      afterHours: 75     // AED 75 for after-hours service
    },
    
    // Payment Terms
    installmentThreshold: 1000, // Minimum amount for installment
    advancePayment: 0.30        // 30% advance for installments
  },

  // ============================================================================
  // SERVICE AREAS & COVERAGE
  // ============================================================================
  serviceAreas: {
    primary: ["Dubai"],
    secondary: ["Sharjah", "Ajman"],
    emirates: [
      { value: 'dubai', label: 'Dubai', covered: true },
      { value: 'sharjah', label: 'Sharjah', covered: true },
      { value: 'ajman', label: 'Ajman', covered: true },
      { value: 'abu-dhabi', label: 'Abu Dhabi', covered: false },
      { value: 'ras-al-khaimah', label: 'Ras Al Khaimah', covered: false },
      { value: 'fujairah', label: 'Fujairah', covered: false },
      { value: 'umm-al-quwain', label: 'Umm Al Quwain', covered: false }
    ]
  },

  // ============================================================================
  // WEBSITE SETTINGS
  // ============================================================================
  website: {
    title: "ServDubai - Dubai's Premier Building Services",
    description: "Professional building maintenance and property services for new apartment residents in Dubai. AMC packages, emergency repairs, and comprehensive building solutions.",
    keywords: [
      "Dubai building services", "property maintenance Dubai", "AMC Dubai", 
      "apartment services", "building management", "new resident services", 
      "emergency repairs Dubai", "HVAC Dubai", "plumbing Dubai", "electrical services Dubai"
    ],
    
    // Social Media
    social: {
      facebook: "https://facebook.com/servdubai",
      instagram: "https://instagram.com/servdubai", 
      twitter: "https://twitter.com/servdubai",
      linkedin: "https://linkedin.com/company/servdubai",
      youtube: "https://youtube.com/servdubai"
    },
    
    // SEO Settings
    seo: {
      ogImage: "/og-image.jpg",
      favicon: "/favicon.svg",
      appleTouchIcon: "/apple-touch-icon.png"
    }
  },

  // ============================================================================
  // OPERATIONAL SETTINGS
  // ============================================================================
  operations: {
    // Time Slots
    timeSlots: [
      { value: '08:00-10:00', label: '8:00 AM - 10:00 AM' },
      { value: '10:00-12:00', label: '10:00 AM - 12:00 PM' },
      { value: '12:00-14:00', label: '12:00 PM - 2:00 PM' },
      { value: '14:00-16:00', label: '2:00 PM - 4:00 PM' },
      { value: '16:00-18:00', label: '4:00 PM - 6:00 PM' },
      { value: '18:00-20:00', label: '6:00 PM - 8:00 PM' },
    ],
    
    // Marketing Sources
    marketingSources: [
      { value: 'google', label: 'Google Search' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'referral', label: 'Friend/Family Referral' },
      { value: 'website', label: 'Direct Website Visit' },
      { value: 'flyer', label: 'Flyer/Advertisement' },
      { value: 'other', label: 'Other' }
    ],
    
    // Response Times  
    responseTimes: {
      bookingConfirmation: "2 hours",
      emergencyResponse: "Same day",
      regularService: "Within 1-2 days",
      amcResponse: "Priority scheduling"
    }
  },

  // ============================================================================
  // LEGAL & COMPLIANCE
  // ============================================================================
  legal: {
    companyRegistration: "Trade License: 123456789",
    vatNumber: "VAT: 100123456789003",
    insurance: "Fully insured and bonded",
    certifications: [
      "Dubai Municipality Approved",
      "DEWA Certified Contractors", 
      "Safety Compliance Certified",
      "Quality Management ISO 9001"
    ]
  }
};

// Helper Functions
export const getTeamMember = (name: string) => {
  const allTeam = [
    ...siteConfig.team.management,
    ...siteConfig.team.technicalLeads,
    ...siteConfig.team.customerService
  ];
  return allTeam.find(member => member.name === name);
};

export const getServicePrice = (serviceType: string, packageType: string) => {
  if (serviceType === 'newResident') {
    return (siteConfig.pricing.newResidentPackages as any)[packageType]?.price || 0;
  }
  if (serviceType === 'amc') {
    return (siteConfig.pricing.amcPackages as any)[packageType]?.annual || 0;
  }
  if (serviceType === 'individual') {
    return (siteConfig.pricing.individualServices as any)[packageType]?.price || 0;
  }
  return 0;
};

export const formatPrice = (price: number): string => {
  return `AED ${price.toLocaleString()}`;
};

export const getWhatsAppLink = (message: string = "Hi ServDubai! I need assistance with building services.") => {
  return `https://wa.me/${siteConfig.business.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

export default siteConfig;
