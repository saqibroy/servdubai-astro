interface Specialist {
  name: string;
  phone: string;
  specialization: string;
  experience: string;
  expertise: string[];
  email: string;
}

interface TeamMember {
  name: string;
  position: string;
  phone: string;
  email: string;
  expertise?: string[];
  languages: string[];
}

interface CompanyConfig {
  name: string;
  legalName: string;
  registration: {
    tradeLicense: string;
    vatNumber: string;
    establishment: number;
  };
  certifications: string[];
  mainEmail: string;
  phone: {
    main: string;
    emergency: string;
    sales: string;
  };
  whatsapp: string;
  address: {
    office: string;
    city: string;
    country: string;
  };
  website: string;
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  team: {
    management: TeamMember[];
    specialists: {
      kitchen: Specialist;
      bathroom: Specialist;
      flooring: Specialist;
      woodwork: Specialist;
      painting: Specialist;
    };
    coordinators: TeamMember[];
  };
  emailConfig: {
    addresses: {
      info: string;
      projects: string;
      support: string;
      careers: string;
      construction: string;
      maintenance: string;
      sales: string;
    };
    notifications: {
      projectAssessments: string[];
      generalInquiries: string[];
      emergencies: string[];
    };
    defaultSMTP: {
      host: string;
      port: number;
      secure: boolean;
    };
  };
  serviceAreas: string[];
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    emergency: string;
  };
}

export const companyConfig: CompanyConfig = {
  // Company Details
  name: 'ServDubai',
  legalName: 'ServDubai Technical Services LLC',
  registration: {
    tradeLicense: 'DED-123456',
    vatNumber: 'TRN-987654321',
    establishment: 2015,
  },
  certifications: [
    "Dubai Municipality Approved Contractor",
    "DEWA Certified Installation Contractors", 
    "Construction Safety Compliance Certified",
    "Quality Management ISO 9001",
    "Building Finishing Specialists License"
  ],

  // Contact Information
  mainEmail: 'info@servdubai.ae',
  phone: {
    main: '+971 55 241 8446',
    emergency: '+971 55 241 8447',
    sales: '+971 55 241 8448',
  },
  whatsapp: '971552418446', // Without '+' for WhatsApp links
  address: {
    office: 'Business Bay',
    city: 'Dubai',
    country: 'United Arab Emirates',
  },
  website: 'https://servdubai.ae',
  
  // Social Media
  social: {
    instagram: '@ServDubaiConstruction',
    facebook: 'ServDubaiConstruction',
    linkedin: 'servdubai',
  },

  // Team Members
  team: {
    management: [
      {
        name: 'Mohammed Al-Falasi',
        position: 'Managing Director',
        phone: '+971 55 241 8446',
        email: 'mohammed@servdubai.ae',
        expertise: ['Project Management', 'Construction Planning', 'Client Relations'],
        languages: ['English', 'Arabic'],
      },
      {
        name: 'Ahmed Al-Mansouri',
        position: 'Operations Director',
        phone: '+971 55 241 8447',
        email: 'ahmed@servdubai.ae',
        expertise: ['Operations Management', 'Quality Control', 'Team Leadership'],
        languages: ['English', 'Arabic', 'Hindi'],
      },
    ],
    specialists: {
      kitchen: {
        name: 'Rashid Al-Nuaimi',
        phone: '+971 55 241 8447',
        specialization: 'Kitchen Installation Specialist',
        experience: '12+ years in kitchen finishing',
        expertise: ['Cabinet installation', 'Countertop fitting', 'Appliance connections', 'Custom storage solutions'],
        email: 'kitchen@servdubai.ae',
      },
      bathroom: {
        name: 'Omar Hassan',
        phone: '+971 55 241 8448',
        specialization: 'Bathroom Finishing Specialist',
        experience: '10+ years in bathroom construction',
        expertise: ['Fixture installation', 'Tile & marble work', 'Plumbing connections', 'Waterproofing'],
        email: 'bathroom@servdubai.ae',
      },
      flooring: {
        name: 'Khalid Al-Zahra',
        phone: '+971 55 241 8449',
        specialization: 'Flooring & Tiling Specialist',
        experience: '15+ years in marble & tile installation',
        expertise: ['Marble installation', 'Granite fitting', 'Ceramic tiling', 'Floor polishing'],
        email: 'flooring@servdubai.ae',
      },
      woodwork: {
        name: 'Saeed Al-Rashid',
        phone: '+971 55 241 8450',
        specialization: 'Woodwork & Carpentry Specialist',
        experience: '14+ years in custom carpentry',
        expertise: ['Built-in wardrobes', 'Custom cabinets', 'Door finishing', 'Wooden flooring'],
        email: 'woodwork@servdubai.ae',
      },
      painting: {
        name: 'Hassan Al-Maktoum',
        phone: '+971 55 241 8451',
        specialization: 'Painting & Finishing Specialist',
        experience: '11+ years in building painting',
        expertise: ['Interior painting', 'Exterior painting', 'Decorative finishes', 'Surface preparation'],
        email: 'painting@servdubai.ae',
      },
    },
    coordinators: [
      {
        name: 'Sara Ahmed',
        position: 'Client Relations Manager',
        phone: '+971 55 241 8452',
        email: 'customer.care@servdubai.ae',
        languages: ['English', 'Arabic', 'Urdu'],
      },
      {
        name: 'Fatima Al-Ali',
        position: 'Project Coordinator',
        phone: '+971 55 241 8453',
        email: 'projects@servdubai.ae',
        languages: ['English', 'Arabic'],
      },
    ],
  },

  // Email Configuration
  emailConfig: {
    // Main email addresses
    addresses: {
      info: 'info@servdubai.ae',
      projects: 'projects@servdubai.ae',
      support: 'support@servdubai.ae',
      careers: 'careers@servdubai.ae',
      construction: 'construction@servdubai.ae',
      maintenance: 'maintenance@servdubai.ae',
      sales: 'sales@servdubai.ae',
    },
    
    // Notification settings
    notifications: {
      projectAssessments: ['projects@servdubai.ae', 'construction@servdubai.ae'],
      generalInquiries: ['info@servdubai.ae'],
      emergencies: ['support@servdubai.ae', 'maintenance@servdubai.ae'],
    },
    
    // Email settings (to be configured via environment variables)
    defaultSMTP: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
    },
  },

  // Service Areas in Dubai
  serviceAreas: [
    'Dubai Marina',
    'Downtown Dubai',
    'Business Bay',
    'DIFC',
    'Dubai Hills',
    'City Walk',
    'Al Barsha',
    'Jumeirah',
    'Dubai South',
    'Dubai Investment Park',
  ],

  // Working Hours
  workingHours: {
    weekdays: '8:00 AM - 8:00 PM',
    saturday: '9:00 AM - 6:00 PM',
    sunday: '9:00 AM - 4:00 PM',
    emergency: '24/7',
  },

};

// Export individual sections for convenience
export const {
  team,
  emailConfig,
  phone,
  address,
  serviceAreas,
  workingHours,
  registration,
} = companyConfig;
