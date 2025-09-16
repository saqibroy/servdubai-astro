import { companyConfig } from './company';

export interface ConstructionService {
  id: string;
  name: string;
  description: string;
  startingPrice: number;
  priceUnit: string;
  imageUrl: string;
  imageDimensions?: string;
  altText?: string;
  features: string[];
  targetAudience: string;
}

export type ConstructionServices = {
  [key: string]: ConstructionService;
}

export interface SiteConfig {
  business: {
    name: string;
    tagline: string;
    description: string;
    phone: string;
    phoneDisplay: string;
    whatsappNumber: string;
    email: string;
    website: string;
    address: {
      street: string;
      city: string;
      country: string;
      countryCode: string;
      region: string;
      coordinates: {
        latitude: string;
        longitude: string;
      };
    };
    hours: {
      display: string;
      emergency: string;
      regular: string;
      timezone: string;
    };
    serviceAreas: string[];
    targetMarket: string[];
  };
  constructionSpecialists: Array<{
    name: string;
    position: string;
    email: string;
    phone: string;
    certifications: string[];
    experience: string;
    specialties: string[];
  }>;
  projectCoordination: Array<{
    name: string;
    position: string;
    email: string;
    phone: string;
    languages: string[];
    availability: string;
  }>;
  services: {
    constructionFinishing: {
      [key: string]: ConstructionService;
    };
  };
  packages: {
    constructionPackages: {
      [key: string]: {
        name: string;
        priceRange: [number, number];
        description: string;
        targetMarket: string;
        features: string[];
        bulkDiscount: boolean;
        siteVisitIncluded: boolean;
        duration: string;
        warranty: string;
      };
    };
    constructionContracts: {
      [key: string]: {
        annual: number;
        quarterly: number;
        name: string;
        description: string;
        features: string[];
        serviceFrequency: string;
        emergencyResponse: string;
        targetMarket: string;
      };
    };
    discounts: {
      bulkProjects: number;
      largeDeveloper: number;
      contractCustomer: number;
      referral: number;
    };
    surcharges: {
      urgentProject: number;
      weekend: number;
      afterHours: number;
    };
    installmentThreshold: number;
    advancePayment: number;
    milestonePayments: boolean;
  };
  pricing: {
    newResidentPackages: {
      [key: string]: {
        price: number;
        description: string;
      };
    };
    amcPackages: {
      [key: string]: {
        annual: number;
        quarterly: number;
        description: string;
      };
    };
    individualServices: {
      [key: string]: {
        price: number;
        description: string;
      };
    };
    surcharges: {
      emergency: number;
    };
    installmentThreshold: number;
    advancePayment: number;
  };
  serviceAreas: {
    primary: string[];
    secondary: string[];
    emirates: Array<{
      value: string;
      label: string;
      covered: boolean;
    }>;
  };
  website: {
    title: string;
    description: string;
    keywords: string[];
    social: {
      facebook: string;
      instagram: string;
      twitter: string;
      linkedin: string;
      youtube: string;
    };
    seo: {
      ogImage: string;
      ogImageAlt: string;
      favicon: string;
      appleTouchIcon: string;
    };
  };
  operations: {
    siteVisitSlots: Array<{
      value: string;
      label: string;
    }>;
    contactMethods: Array<{
      value: string;
      label: string;
    }>;
    contactTimes: Array<{
      value: string;
      label: string;
    }>;
    marketingSources: Array<{
      value: string;
      label: string;
    }>;
    responseTimes: {
      projectAssessment: string;
      siteVisitScheduling: string;
      projectQuote: string;
      contractResponse: string;
    };
    projectTypes: Array<{
      value: string;
      label: string;
    }>;
  };
  legal: {
    companyRegistration: string;
    vatNumber: string;
    insurance: string;
    certifications: string[];
  };
  stats: {
    experience: string;
    specialists: string;
    buildingsCompleted: string;
    projectsCompleted: string;
    clientSatisfaction: string;
    responseTime: string;
  };
}

export const siteConfig: SiteConfig = {
  business: {
    name: "ServDubai 1",
    tagline: "Dubai's Premier Construction Finishing Specialists",
    description: "Professional construction finishing services for newly constructed buildings in Dubai. We complete kitchen installations, bathroom finishing, flooring, woodwork, painting, and AC setup for developers and contractors.",
    phone: "+971552418446",
    phoneDisplay: "+971 55 241 8446",
    whatsappNumber: "971552418446",
    email: "info@servdubai.com",
    website: "https://servdubai.netlify.app",
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
    hours: {
      display: "24/7 Emergency Service Available",
      emergency: "24/7",
      regular: "Mo-Su 08:00-20:00",
      timezone: "Asia/Dubai"
    },
    serviceAreas: [
      "Dubai Marina", "Downtown Dubai", "Business Bay", "DIFC",
      "Dubai Hills", "City Walk", "Al Barsha", "Jumeirah",
      "Dubai South", "Dubai Investment Park", "JBR", "Palm Jumeirah",
      "Deira", "Bur Dubai", "Karama", "Satwa", "Al Qusais"
    ],
    targetMarket: [
      "Construction companies",
      "Real estate developers",
      "Building contractors",
      "Property management companies",
      "Individual apartment owners in new buildings"
    ]
  },
  constructionSpecialists: [
    {
      name: "Hassan Ali",
      position: "Kitchen Installation Specialist",
      email: "hassan@servdubai.com",
      phone: "+971501234569",
      certifications: ["Kitchen Design Certified", "Cabinet Installation Expert"],
      experience: "12 years",
      specialties: ["Kitchen Installations", "Cabinet Fitting", "Countertop Installation", "Appliance Connections"]
    },
    {
      name: "Mohammad Rashid",
      position: "Bathroom Finishing Supervisor",
      email: "mohammad@servdubai.com",
      phone: "+971501234570",
      certifications: ["Plumbing Licensed", "Tile Installation Certified"],
      experience: "10 years",
      specialties: ["Bathroom Fixtures", "Tile & Marble Work", "Plumbing Connections", "Waterproofing"]
    },
    {
      name: "Priya Sharma",
      position: "Flooring & Tiling Expert",
      email: "priya@servdubai.com",
      phone: "+971501234571",
      certifications: ["Marble Installation Certified", "Flooring Specialist"],
      experience: "8 years",
      specialties: ["Marble Installation", "Granite Fitting", "Ceramic Tiling", "Floor Polishing"]
    },
    {
      name: "Ahmed Al-Mansouri",
      position: "Woodwork & Carpentry Lead",
      email: "ahmed@servdubai.com",
      phone: "+971501234574",
      certifications: ["Master Carpenter", "Custom Furniture Designer"],
      experience: "14 years",
      specialties: ["Built-in Wardrobes", "Custom Cabinets", "Door Finishing", "Wooden Flooring"]
    },
    {
      name: "Carlos Rodriguez",
      position: "Painting & Finishing Specialist",
      email: "carlos@servdubai.com",
      phone: "+971501234575",
      certifications: ["Professional Painter", "Surface Preparation Expert"],
      experience: "9 years",
      specialties: ["Interior Painting", "Exterior Painting", "Decorative Finishes", "Surface Preparation"]
    },
    {
      name: "Raj Patel",
      position: "AC Installation Technician",
      email: "raj@servdubai.com",
      phone: "+971501234576",
      certifications: ["HVAC Certified", "AC Installation Expert"],
      experience: "11 years",
      specialties: ["Split AC Installation", "Central AC Setup", "Ductwork", "System Commissioning"]
    }
  ],
  projectCoordination: [
    {
      name: "Fatima Al-Zahra",
      position: "Project Coordinator",
      email: "projects@servdubai.com",
      phone: "+971501234572",
      languages: ["English", "Arabic", "Hindi"],
      availability: "8 AM - 6 PM"
    },
    {
      name: "John Martinez",
      position: "Site Visit Coordinator",
      email: "sitevisits@servdubai.com",
      phone: "+971501234573",
      languages: ["English", "Spanish"],
      availability: "8 AM - 8 PM"
    }
  ],
  services: {
    constructionFinishing: {
      kitchen: {
        id: "kitchen-finishing",
        name: "Kitchen Finishing Projects",
        description: "From empty shells to dream kitchens - complete installations including cabinets, countertops, appliances, and connections",
        startingPrice: 2500,
        priceUnit: "per project",
        features: ["Cabinet installation", "Countertop fitting", "Appliance connections", "Plumbing & electrical work"],
        targetAudience: "Developers & contractors",
        imageUrl: "/services/construction-kitchen-installation.jpg",
        imageDimensions: "800x600px",
        altText: "Professional kitchen installation work showing cabinet fitting, countertop installation, and appliance connections in Dubai construction project"
      },
      bathroom: {
        id: "bathroom-finishing",
        name: "Bathroom Construction Completion",
        description: "Professional bathroom finishing including fixture installation, tiling, marble work, and plumbing connections",
        startingPrice: 1800,
        priceUnit: "per project",
        features: ["Fixture installation", "Tile & marble work", "Plumbing connections", "Waterproofing"],
        targetAudience: "Construction companies and contractors",
        imageUrl: "/services/construction-bathroom-finishing.jpg",
        imageDimensions: "800x600px",
        altText: "Bathroom finishing work including fixture installation, tile work, and plumbing connections for new building construction"
      },
      flooring: {
        id: "flooring-tiling",
        name: "Flooring & Tiling Specialists",
        description: "Expert marble, granite, and tile installation for new buildings - we make floors beautiful and durable",
        startingPrice: 80,
        priceUnit: "per sqm",
        features: ["Marble installation", "Granite fitting", "Ceramic tiling", "Floor polishing"],
        targetAudience: "Building developers and owners",
        imageUrl: "/services/construction-marble-installation.jpg",
        imageDimensions: "1200x800px",
        altText: "Marble and tile installation work showing premium flooring installation for Dubai construction project"
      },
      woodwork: {
        id: "woodwork-carpentry",
        name: "Custom Woodwork & Carpentry",
        description: "Built-in wardrobes, custom cabinets, and wooden installations that transform new apartments into homes",
        startingPrice: 1200,
        priceUnit: "per project",
        features: ["Built-in wardrobes", "Custom cabinets", "Door finishing", "Wooden flooring"],
        targetAudience: "Property developers and individual owners",
        imageUrl: "/services/construction-woodwork-carpentry.jpg",
        imageDimensions: "800x600px",
        altText: "Custom woodwork and carpentry installation including built-in wardrobes and cabinet work for new construction"
      },
      painting: {
        id: "painting-finishing",
        name: "Building Painting & Finishing",
        description: "Complete interior and exterior painting services for new constructions - from primer to final decorative finishes",
        startingPrice: 25,
        priceUnit: "per sqm",
        features: ["Interior painting", "Exterior painting", "Primer application", "Decorative finishes"],
        targetAudience: "Construction companies and building owners",
        imageUrl: "/services/construction-building-painting.jpg",
        imageDimensions: "1000x600px",
        altText: "Building painting and finishing work showing interior and exterior painting for Dubai construction project"
      },
      ac: {
        id: "ac-installation",
        name: "AC Installation & Setup",
        description: "Professional air conditioning installation and setup for new buildings - ensuring comfort from day one",
        startingPrice: 800,
        priceUnit: "per unit",
        features: ["Split AC installation", "Central AC setup", "Ductwork", "System commissioning"],
        targetAudience: "Developers and building contractors",
        imageUrl: "/services/construction-ac-installation.jpg",
        imageDimensions: "800x600px",
        altText: "AC installation and setup work showing split unit installation and ductwork for new building construction"
      }
    }
  },
  packages: {
    constructionPackages: {
      "new-building-package": {
        name: "New Building Package",
        priceRange: [8000, 15000],
        description: "Complete apartment finishing (kitchen + bathroom + flooring)",
        targetMarket: "Perfect for developers handing over units",
        features: ["Bulk pricing for multiple units", "Flexible timeline to match construction schedules", "Quality guarantee", "Project management included"],
        bulkDiscount: true,
        siteVisitIncluded: true,
        duration: "2-4 weeks per unit",
        warranty: "12 months"
      },
      "kitchen-bathroom-combo": {
        name: "Kitchen & Bathroom Combo",
        priceRange: [4500, 8000],
        description: "Complete kitchen and bathroom finishing",
        targetMarket: "Ideal for apartment upgrades",
        features: ["Includes all installations and connections", "Quality materials included", "Professional project coordination"],
        bulkDiscount: false,
        siteVisitIncluded: true,
        duration: "1-2 weeks",
        warranty: "12 months"
      },
      "flooring-specialist": {
        name: "Flooring Specialist Package",
        priceRange: [3000, 6000],
        description: "Complete flooring installation (marble/tile/wood)",
        targetMarket: "Perfect for large area projects",
        features: ["Surface preparation and finishing", "Premium material options", "Professional installation team"],
        bulkDiscount: true,
        siteVisitIncluded: true,
        duration: "1-3 weeks",
        warranty: "24 months"
      },
      "custom-project-quotes": {
        name: "Custom Project Quotes",
        priceRange: [0, 0],
        description: "Tailored solutions for unique construction finishing needs",
        targetMarket: "All construction industry clients",
        features: ["Site visit and detailed assessment", "Customized pricing based on scope", "Flexible timeline to match construction schedules", "Dedicated project manager"],
        bulkDiscount: true,
        siteVisitIncluded: true,
        duration: "Variable based on scope",
        warranty: "12-24 months"
      }
    },
    constructionContracts: {
      "building-maintenance": {
        annual: 15000,
        quarterly: 3750,
        name: "Building Maintenance Contract",
        description: "Ongoing maintenance for completed construction projects",
        features: ["Quarterly inspections", "Touch-up work included", "Priority response", "Warranty extensions"],
        serviceFrequency: "Quarterly",
        emergencyResponse: "Same day",
        targetMarket: "Property developers and building owners"
      },
      "developer-support": {
        annual: 25000,
        quarterly: 6250,
        name: "Developer Support Contract",
        description: "Comprehensive support for multiple building projects",
        features: ["Monthly site visits", "All finishing work covered", "24/7 project support", "Bulk project discounts"],
        serviceFrequency: "Monthly",
        emergencyResponse: "2 hours",
        targetMarket: "Real estate developers and construction companies"
      },
      "contractor-partnership": {
        annual: 20000,
        quarterly: 5000,
        name: "Contractor Partnership",
        description: "Partnership program for construction contractors",
        features: ["Bi-monthly consultations", "Preferred pricing", "Priority scheduling", "Joint project planning"],
        serviceFrequency: "Bi-monthly",
        emergencyResponse: "4 hours",
        targetMarket: "Building contractors and construction companies"
      }
    },
    discounts: {
      bulkProjects: 0.15,
      largeDeveloper: 0.20,
      contractCustomer: 0.10,
      referral: 0.05
    },
    surcharges: {
      urgentProject: 200,
      weekend: 100,
      afterHours: 150
    },
    installmentThreshold: 5000,
    advancePayment: 0.40,
    milestonePayments: true
  },
  pricing: {
    newResidentPackages: {
      "move-in": {
        price: 800,
        description: "Move-in Ready Package - Complete apartment preparation"
      },
      "first-month": {
        price: 0,
        description: "First Month Free Package - Complimentary inspection + discounts"
      },
      "new-building": {
        price: 0,
        description: "New Building Special - 30% off all services"
      }
    },
    amcPackages: {
      "basic": {
        annual: 1200,
        quarterly: 300,
        description: "Basic AMC Package"
      },
      "family": {
        annual: 1800,
        quarterly: 450,
        description: "Family AMC Package"
      },
      "premium": {
        annual: 2500,
        quarterly: 625,
        description: "Premium AMC Package"
      }
    },
    individualServices: {
      "ac-service": {
        price: 200,
        description: "AC Service & Maintenance"
      },
      "plumbing": {
        price: 150,
        description: "Plumbing Services"
      },
      "electrical": {
        price: 180,
        description: "Electrical Services"
      },
      "cleaning": {
        price: 120,
        description: "Deep Cleaning Service"
      }
    },
    surcharges: {
      emergency: 100
    },
    installmentThreshold: 1000,
    advancePayment: 0.30
  },
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
  website: {
    title: "ServDubai - Dubai's Premier Construction Finishing Specialists",
    description: "Professional construction finishing services for newly constructed buildings in Dubai. We complete kitchen installations, bathroom finishing, flooring, woodwork, painting, and AC setup for developers and contractors.",
    keywords: [
      "construction finishing Dubai", "kitchen installation Dubai", "bathroom finishing Dubai",
      "flooring installation Dubai", "marble installation Dubai", "construction contractors Dubai",
      "building finishing services", "developer services Dubai", "construction specialists Dubai",
      "woodwork installation Dubai", "painting contractors Dubai", "AC installation Dubai"
    ],
    social: {
      facebook: "https://facebook.com/servdubai",
      instagram: "https://instagram.com/servdubai",
      twitter: "https://twitter.com/servdubai",
      linkedin: "https://linkedin.com/company/servdubai",
      youtube: "https://youtube.com/servdubai"
    },
    seo: {
      ogImage: "/construction-finishing-dubai-og.jpg",
      ogImageAlt: "ServDubai construction finishing specialists working on kitchen and bathroom installations in Dubai new buildings",
      favicon: "/favicon.svg",
      appleTouchIcon: "/apple-touch-icon.png"
    }
  },
  operations: {
    siteVisitSlots: [
      { value: '08:00-10:00', label: '8:00 AM - 10:00 AM' },
      { value: '10:00-12:00', label: '10:00 AM - 12:00 PM' },
      { value: '12:00-14:00', label: '12:00 PM - 2:00 PM' },
      { value: '14:00-16:00', label: '2:00 PM - 4:00 PM' },
      { value: '16:00-18:00', label: '4:00 PM - 6:00 PM' },
      { value: '18:00-20:00', label: '6:00 PM - 8:00 PM' }
    ],
    contactMethods: [
      { value: 'whatsapp', label: 'WhatsApp Consultation' },
      { value: 'phone', label: 'Phone Call Discussion' },
      { value: 'onsite', label: 'On-site Visit and Quote' },
      { value: 'email', label: 'Email Project Details' }
    ],
    contactTimes: [
      { value: 'morning', label: 'Morning (9AM-12PM)' },
      { value: 'afternoon', label: 'Afternoon (12PM-5PM)' },
      { value: 'evening', label: 'Evening (5PM-8PM)' },
      { value: 'weekend', label: 'Weekend Availability Needed' }
    ],
    marketingSources: [
      { value: 'google', label: 'Google Search' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'developer-referral', label: 'Developer Referral' },
      { value: 'contractor-referral', label: 'Contractor Referral' },
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'website', label: 'Direct Website Visit' },
      { value: 'construction-network', label: 'Construction Industry Network' },
      { value: 'other', label: 'Other' }
    ],
    responseTimes: {
      projectAssessment: "Within 4 hours",
      siteVisitScheduling: "Same day",
      projectQuote: "Within 24 hours",
      contractResponse: "Priority scheduling"
    },
    projectTypes: [
      { value: 'kitchen', label: 'Kitchen Installation & Setup' },
      { value: 'bathroom', label: 'Bathroom Finishing Work' },
      { value: 'flooring', label: 'Flooring & Tiling' },
      { value: 'woodwork', label: 'Custom Woodwork' },
      { value: 'painting', label: 'Painting & Finishing' },
      { value: 'ac', label: 'AC Installation' },
      { value: 'complete', label: 'Complete Building Finishing' }
    ]
  },
  legal: {
    companyRegistration: "Trade License: 123456789",
    vatNumber: "VAT: 100123456789003",
    insurance: "Fully insured and bonded for construction work",
    certifications: [
      "Dubai Municipality Approved Contractor",
      "DEWA Certified Installation Contractors",
      "Construction Safety Compliance Certified",
      "Quality Management ISO 9001",
      "Building Finishing Specialists License"
    ]
  },
  stats: {
    experience: "15+ Years",
    specialists: "20+ Skilled Specialists",
    buildingsCompleted: "500+ Buildings Completed",
    projectsCompleted: "2000+ Projects Completed",
    clientSatisfaction: "98% Client Satisfaction",
    responseTime: "Same-Day Site Visits"
  }
};

// Helper Functions
export const getTeamMember = (name: string) => {
  const allTeam = [
    ...siteConfig.constructionSpecialists,
    ...siteConfig.projectCoordination
  ];
  return allTeam.find(member => member.name === name);
};

export const getConstructionService = (serviceId: string) => {
  return (siteConfig.services.constructionFinishing as any)[serviceId] || null;
};

export const getConstructionPackage = (packageType: string) => {
  return (siteConfig.packages.constructionPackages as any)[packageType] || null;
};

export const getConstructionContract = (contractType: string) => {
  return (siteConfig.packages.constructionContracts as any)[contractType] || null;
};

export const formatPrice = (price: number): string => {
  return `AED ${price.toLocaleString()}`;
};

export const formatPriceRange = (priceRange: [number, number]): string => {
  if (priceRange[0] === 0 && priceRange[1] === 0) {
    return "Custom Quote";
  }
  return `AED ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}`;
};

export const getWhatsAppLink = (message: string = "Hi ServDubai! I need assistance with construction finishing services.") => {
  return `https://wa.me/${siteConfig.business.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

export const getProjectWhatsAppLink = (projectType: string, location: string = "") => {
  const message = `Hi ServDubai! I need a quote for ${projectType} finishing work${location ? ` at ${location}` : ''}. Can we schedule a site visit?`;
  return getWhatsAppLink(message);
};

export default siteConfig;
