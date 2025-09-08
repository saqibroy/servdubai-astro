// Re-export types from the validation schema for consistency
export type { ProjectAssessmentData } from '../schemas/projectAssessmentValidation';

export type ProjectType = 'kitchen' | 'bathroom' | 'flooring' | 'woodwork' | 'painting' | 'ac' | 'complete';

export type ContactMethod = 'whatsapp' | 'phone' | 'onsite' | 'email';

export type ContactTime = 'morning' | 'afternoon' | 'evening' | 'weekend';

export interface ProjectLocation {
    buildingName: string;
    area: string;
    unitNumber?: string;
}

export interface ContactInfo {
    name: string;
    phone: string;
    email: string;
    company?: string;
}

export interface KitchenRequirements {
    cabinetInstallation?: boolean;
    countertopInstallation?: boolean;
    applianceConnections?: boolean;
    plumbingWork?: boolean;
    electricalConnections?: boolean;
    customStorage?: boolean;
}

export interface BathroomRequirements {
    showerBathtubInstallation?: boolean;
    toiletSinkInstallation?: boolean;
    tileMarbleInstallation?: boolean;
    plumbingConnections?: boolean;
    mirrorCabinetInstallation?: boolean;
    waterproofing?: boolean;
}

export interface FlooringRequirements {
    marbleInstallation?: boolean;
    graniteInstallation?: boolean;
    ceramicTiling?: boolean;
    floorPolishing?: boolean;
    surfacePreparation?: boolean;
}

export interface WoodworkRequirements {
    builtInWardrobes?: boolean;
    customCabinets?: boolean;
    doorFinishing?: boolean;
    woodenFlooring?: boolean;
    customCarpentry?: boolean;
}

export interface PaintingRequirements {
    interiorPainting?: boolean;
    exteriorPainting?: boolean;
    primerApplication?: boolean;
    decorativeFinishes?: boolean;
    touchUpWork?: boolean;
}

export interface ACRequirements {
    splitAcInstallation?: boolean;
    centralAcSetup?: boolean;
    ductwork?: boolean;
    systemCommissioning?: boolean;
    thermostatInstallation?: boolean;
}

export interface ProjectPricing {
    kitchen: {
        starting: 2500;
        range: [2500, 8000];
    };
    bathroom: {
        starting: 1800;
        range: [1800, 6000];
    };
    flooring: {
        starting: 80;
        unit: 'per sqm';
        range: [80, 200];
    };
    woodwork: {
        starting: 1200;
        range: [1200, 5000];
    };
    painting: {
        starting: 25;
        unit: 'per sqm';
        range: [25, 60];
    };
    ac: {
        starting: 800;
        range: [800, 3000];
    };
}

export interface ProjectPackage {
    id: string;
    name: string;
    priceRange: [number, number];
    description: string;
    targetMarket: string;
    features: string[];
    bulkDiscount: boolean;
    siteVisitIncluded: boolean;
}

export interface ProjectAssessmentConfirmation {
    projectId: string;
    projectType: ProjectType;
    estimatedQuote?: {
        min: number;
        max: number;
        currency: 'AED';
    };
    siteVisitScheduled?: {
        date: string;
        timeSlot: string;
    };
    contactMethod: ContactMethod;
    specialist?: {
        name: string;
        phone: string;
        specialization: string;
    };
    whatsappGroupLink?: string;
}

export interface ProjectSubmissionError {
    type: 'validation' | 'upload' | 'network' | 'server';
    message: string;
    field?: string;
    retryable: boolean;
}