import { z } from 'zod';

// File validation schema for image uploads
const fileSchema = z.instanceof(File).refine(
  (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    return allowedTypes.includes(file.type);
  },
  { message: 'File must be JPG, PNG, or PDF format' }
).refine(
  (file) => file.size <= 5 * 1024 * 1024, // 5MB limit
  { message: 'File size must be less than 5MB' }
);

// Base schema without refinements for picking
const baseProjectAssessmentSchema = z.object({
  // Step 1: Project Type Selection
  projectType: z.enum(['kitchen', 'bathroom', 'flooring', 'woodwork', 'painting', 'ac', 'complete'], {
    required_error: 'Please select a project type'
  }),
  subServices: z.array(z.string()).optional(),

  // Step 2: Project Details & Images
  projectLocation: z.object({
    buildingName: z.string().min(1, 'Building name is required'),
    area: z.string().min(1, 'Area is required'),
    unitNumber: z.string().optional()
  }),
  projectSize: z.string().min(1, 'Project size is required'),
  currentStatus: z.string().min(1, 'Current status is required'),
  timeline: z.string().min(1, 'Timeline is required'),
  projectImages: z.array(fileSchema).max(10, 'Maximum 10 files allowed').optional(),

  // Step 3: Project Scope & Requirements
  kitchenRequirements: z.object({
    cabinetInstallation: z.boolean().optional(),
    countertopInstallation: z.boolean().optional(),
    applianceConnections: z.boolean().optional(),
    plumbingWork: z.boolean().optional(),
    electricalConnections: z.boolean().optional(),
    customStorage: z.boolean().optional()
  }).optional(),

  bathroomRequirements: z.object({
    showerBathtubInstallation: z.boolean().optional(),
    toiletSinkInstallation: z.boolean().optional(),
    tileMarbleInstallation: z.boolean().optional(),
    plumbingConnections: z.boolean().optional(),
    mirrorCabinetInstallation: z.boolean().optional(),
    waterproofing: z.boolean().optional()
  }).optional(),

  flooringRequirements: z.object({
    marbleInstallation: z.boolean().optional(),
    graniteInstallation: z.boolean().optional(),
    ceramicTiling: z.boolean().optional(),
    floorPolishing: z.boolean().optional(),
    surfacePreparation: z.boolean().optional()
  }).optional(),

  woodworkRequirements: z.object({
    builtInWardrobes: z.boolean().optional(),
    customCabinets: z.boolean().optional(),
    doorFinishing: z.boolean().optional(),
    woodenFlooring: z.boolean().optional(),
    customCarpentry: z.boolean().optional()
  }).optional(),

  paintingRequirements: z.object({
    interiorPainting: z.boolean().optional(),
    exteriorPainting: z.boolean().optional(),
    primerApplication: z.boolean().optional(),
    decorativeFinishes: z.boolean().optional(),
    touchUpWork: z.boolean().optional()
  }).optional(),

  acRequirements: z.object({
    splitAcInstallation: z.boolean().optional(),
    centralAcSetup: z.boolean().optional(),
    ductwork: z.boolean().optional(),
    systemCommissioning: z.boolean().optional(),
    thermostatInstallation: z.boolean().optional()
  }).optional(),

  additionalDetails: z.string().max(1000, 'Additional details cannot exceed 1000 characters').optional(),

  // Step 4: Contact & Site Visit
  contactInfo: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^(\+971|00971|971)?[0-9]{8,9}$/, 'Please enter a valid UAE phone number'),
    email: z.string().email('Please enter a valid email address'),
    company: z.string().optional()
  }),

  projectAddress: z.object({
    buildingName: z.string().min(1, 'Building name is required'),
    areaDistrict: z.string().min(1, 'Area/District is required'),
    unitNumber: z.string().optional()
  }),

  preferredContactMethod: z.enum(['whatsapp', 'phone', 'onsite', 'email'], {
    required_error: 'Please select a preferred contact method'
  }),
  bestContactTime: z.enum(['morning', 'afternoon', 'evening', 'weekend'], {
    required_error: 'Please select the best time to contact you'
  }),

  // Terms and agreements
  agreedToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  agreedToPrivacy: z.boolean().refine(val => val === true, 'You must agree to the privacy policy')
});

// Full schema - for now, make it more lenient for testing
export const projectAssessmentSchema = baseProjectAssessmentSchema;

export type ProjectAssessmentData = z.infer<typeof projectAssessmentSchema>;

// Step-specific schemas for validation
export const step1Schema = baseProjectAssessmentSchema.pick({
  projectType: true,
  subServices: true,
});

export const step2Schema = baseProjectAssessmentSchema.pick({
  projectLocation: true,
  projectSize: true,
  currentStatus: true,
  timeline: true,
  projectImages: true,
});

export const step3Schema = baseProjectAssessmentSchema.pick({
  kitchenRequirements: true,
  bathroomRequirements: true,
  flooringRequirements: true,
  woodworkRequirements: true,
  paintingRequirements: true,
  acRequirements: true,
  additionalDetails: true,
});

export const step4Schema = baseProjectAssessmentSchema.pick({
  contactInfo: true,
  projectAddress: true,
  preferredContactMethod: true,
  bestContactTime: true,
  agreedToTerms: true,
  agreedToPrivacy: true,
});

// Utility function to get requirements schema based on project type
export const getRequirementsSchemaForProjectType = (projectType: string) => {
  switch (projectType) {
    case 'kitchen':
      return baseProjectAssessmentSchema.pick({ kitchenRequirements: true });
    case 'bathroom':
      return baseProjectAssessmentSchema.pick({ bathroomRequirements: true });
    case 'flooring':
      return baseProjectAssessmentSchema.pick({ flooringRequirements: true });
    case 'woodwork':
      return baseProjectAssessmentSchema.pick({ woodworkRequirements: true });
    case 'painting':
      return baseProjectAssessmentSchema.pick({ paintingRequirements: true });
    case 'ac':
      return baseProjectAssessmentSchema.pick({ acRequirements: true });
    case 'complete':
      return baseProjectAssessmentSchema.pick({
        kitchenRequirements: true,
        bathroomRequirements: true,
        flooringRequirements: true,
        woodworkRequirements: true,
        paintingRequirements: true,
        acRequirements: true,
      });
    default:
      return z.object({});
  }
};

// File upload validation helper
export const validateFileUpload = (files: FileList | File[]) => {
  const fileArray = Array.from(files);
  
  if (fileArray.length > 10) {
    throw new Error('Maximum 10 files allowed');
  }

  for (const file of fileArray) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File ${file.name} must be JPG, PNG, or PDF format`);
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`File ${file.name} must be less than 5MB`);
    }
  }

  return true;
};

// Project type options for form
export const projectTypeOptions = [
  { value: 'kitchen', label: 'Kitchen Installation & Setup', description: 'Complete kitchen installation, cabinet and countertop work, appliance connections' },
  { value: 'bathroom', label: 'Bathroom Finishing Work', description: 'Fixture installations, tile and marble work, plumbing connections' },
  { value: 'flooring', label: 'Flooring & Tiling', description: 'Marble/granite installation, ceramic/porcelain tiling, floor finishing' },
  { value: 'woodwork', label: 'Custom Woodwork', description: 'Built-in wardrobes and cabinets, custom carpentry work, door finishing' },
  { value: 'painting', label: 'Painting & Finishing', description: 'Interior wall painting, exterior building painting, touch-up work' },
  { value: 'ac', label: 'AC Installation', description: 'Split AC installation, central AC setup, ductwork and ventilation' },
  { value: 'complete', label: 'Complete Building Finishing', description: 'Multiple services combined, full apartment/building finishing' }
];

// Contact method options
export const contactMethodOptions = [
  { value: 'whatsapp', label: 'WhatsApp consultation', description: 'Quick discussion via WhatsApp with project photos' },
  { value: 'phone', label: 'Phone call discussion', description: 'Detailed phone conversation about your project' },
  { value: 'onsite', label: 'On-site visit and quote', description: 'Professional site visit for accurate assessment' },
  { value: 'email', label: 'Email project details', description: 'Detailed project discussion via email' }
];

// Contact time options
export const contactTimeOptions = [
  { value: 'morning', label: 'Morning (9AM-12PM)', description: 'Best for site visits and detailed discussions' },
  { value: 'afternoon', label: 'Afternoon (12PM-5PM)', description: 'Good for phone calls and consultations' },
  { value: 'evening', label: 'Evening (5PM-8PM)', description: 'Convenient for working professionals' },
  { value: 'weekend', label: 'Weekend availability needed', description: 'Saturday or Sunday contact preferred' }
];