import type { ProjectType, ProjectAssessmentData } from '../types/projectAssessment';
import siteConfig from '../config/site';

// ============================================================================
// CONSTRUCTION PROJECT PRICING UTILITIES
// ============================================================================

export interface ProjectPriceCalculation {
  basePrice: number;
  totalPrice: number;
  priceUnit: string;
  discounts: {
    bulkDiscount?: number;
    contractDiscount?: number;
    referralDiscount?: number;
    totalDiscount: number;
  };
  surcharges: {
    urgentProject?: number;
    weekend?: number;
    afterHours?: number;
    totalSurcharge: number;
  };
  breakdown: Array<{
    item: string;
    quantity?: number;
    unitPrice: number;
    total: number;
  }>;
}

export interface ProjectQuoteOptions {
  projectType: ProjectType;
  area?: number; // For per-sqm calculations
  units?: number; // For bulk pricing
  isUrgent?: boolean;
  isWeekend?: boolean;
  isAfterHours?: boolean;
  hasContract?: boolean;
  isReferral?: boolean;
  requirements?: any; // Specific requirements for detailed pricing
}

// Construction service pricing data
export const constructionPricing = {
  kitchen: {
    basePrice: 2500,
    priceRange: [2500, 8000],
    priceUnit: 'per project',
    components: {
      cabinetInstallation: 800,
      countertopInstallation: 600,
      applianceConnections: 400,
      plumbingWork: 500,
      electricalConnections: 300,
      customStorage: 400
    }
  },
  bathroom: {
    basePrice: 1800,
    priceRange: [1800, 6000],
    priceUnit: 'per project',
    components: {
      showerBathtubInstallation: 600,
      toiletSinkInstallation: 400,
      tileMarbleInstallation: 500,
      plumbingConnections: 400,
      mirrorCabinetInstallation: 300,
      waterproofing: 200
    }
  },
  flooring: {
    basePrice: 80,
    priceRange: [80, 200],
    priceUnit: 'per sqm',
    components: {
      marbleInstallation: 120,
      graniteInstallation: 100,
      ceramicTiling: 80,
      floorPolishing: 30,
      surfacePreparation: 25
    }
  },
  woodwork: {
    basePrice: 1200,
    priceRange: [1200, 5000],
    priceUnit: 'per project',
    components: {
      builtInWardrobes: 800,
      customCabinets: 600,
      doorFinishing: 300,
      woodenFlooring: 150, // per sqm
      customCarpentry: 400
    }
  },
  painting: {
    basePrice: 25,
    priceRange: [25, 60],
    priceUnit: 'per sqm',
    components: {
      interiorPainting: 25,
      exteriorPainting: 35,
      primerApplication: 15,
      decorativeFinishes: 45,
      touchUpWork: 20
    }
  },
  ac: {
    basePrice: 800,
    priceRange: [800, 3000],
    priceUnit: 'per unit',
    components: {
      splitAcInstallation: 800,
      centralAcSetup: 1500,
      ductwork: 200, // per meter
      systemCommissioning: 300,
      thermostatInstallation: 150
    }
  }
} as const;

// Package pricing for B2B construction projects
export const packagePricing = {
  'new-building-package': {
    basePrice: 8000,
    priceRange: [8000, 15000],
    includes: ['kitchen', 'bathroom', 'flooring'],
    bulkDiscount: true
  },
  'kitchen-bathroom-combo': {
    basePrice: 4500,
    priceRange: [4500, 8000],
    includes: ['kitchen', 'bathroom'],
    bulkDiscount: false
  },
  'flooring-specialist': {
    basePrice: 3000,
    priceRange: [3000, 6000],
    includes: ['flooring'],
    bulkDiscount: true
  }
} as const;

/**
 * Calculate project price based on type, area, and options
 */
export function calculateProjectPrice(options: ProjectQuoteOptions): ProjectPriceCalculation {
  const { projectType, area = 0, units = 1, isUrgent = false, isWeekend = false, isAfterHours = false, hasContract = false, isReferral = false, requirements } = options;
  
  const serviceConfig = constructionPricing[projectType];
  if (!serviceConfig) {
    throw new Error(`Invalid project type: ${projectType}`);
  }

  let basePrice = serviceConfig.basePrice;
  const breakdown: Array<{ item: string; quantity?: number; unitPrice: number; total: number }> = [];

  // Calculate base price based on project type
  if (serviceConfig.priceUnit === 'per sqm' && area > 0) {
    basePrice = serviceConfig.basePrice * area;
    breakdown.push({
      item: `${projectType} (${serviceConfig.priceUnit})`,
      quantity: area,
      unitPrice: serviceConfig.basePrice,
      total: basePrice
    });
  } else {
    breakdown.push({
      item: `${projectType} (${serviceConfig.priceUnit})`,
      quantity: units,
      unitPrice: serviceConfig.basePrice,
      total: basePrice * units
    });
    basePrice = basePrice * units;
  }

  // Add component pricing based on requirements
  if (requirements) {
    const componentPricing = serviceConfig.components;
    Object.entries(requirements).forEach(([key, value]) => {
      if (value === true && componentPricing[key as keyof typeof componentPricing]) {
        const componentPrice = componentPricing[key as keyof typeof componentPricing];
        let componentTotal = componentPrice;
        
        // Apply area multiplier for per-sqm components
        if ((projectType === 'flooring' || projectType === 'painting') && area > 0) {
          componentTotal = componentPrice * area;
        } else if (units > 1) {
          componentTotal = componentPrice * units;
        }
        
        basePrice += componentTotal;
        breakdown.push({
          item: key.replace(/([A-Z])/g, ' $1').toLowerCase(),
          quantity: (projectType === 'flooring' || projectType === 'painting') && area > 0 ? area : units,
          unitPrice: componentPrice,
          total: componentTotal
        });
      }
    });
  }

  // Calculate discounts
  const discounts = {
    bulkDiscount: 0,
    contractDiscount: 0,
    referralDiscount: 0,
    totalDiscount: 0
  };

  // Bulk discount for multiple units (5+ units get 15%, 20+ units get 20%)
  if (units >= 20) {
    discounts.bulkDiscount = basePrice * siteConfig.packages.discounts.largeDeveloper;
  } else if (units >= 5) {
    discounts.bulkDiscount = basePrice * siteConfig.packages.discounts.bulkProjects;
  }

  // Contract customer discount
  if (hasContract) {
    discounts.contractDiscount = basePrice * siteConfig.packages.discounts.contractCustomer;
  }

  // Referral discount
  if (isReferral) {
    discounts.referralDiscount = basePrice * siteConfig.packages.discounts.referral;
  }

  discounts.totalDiscount = discounts.bulkDiscount + discounts.contractDiscount + discounts.referralDiscount;

  // Calculate surcharges
  const surcharges = {
    urgentProject: isUrgent ? siteConfig.packages.surcharges.urgentProject : 0,
    weekend: isWeekend ? siteConfig.packages.surcharges.weekend : 0,
    afterHours: isAfterHours ? siteConfig.packages.surcharges.afterHours : 0,
    totalSurcharge: 0
  };

  surcharges.totalSurcharge = surcharges.urgentProject + surcharges.weekend + surcharges.afterHours;

  // Calculate final price
  const totalPrice = basePrice - discounts.totalDiscount + surcharges.totalSurcharge;

  return {
    basePrice,
    totalPrice,
    priceUnit: serviceConfig.priceUnit,
    discounts,
    surcharges,
    breakdown
  };
}

/**
 * Calculate package price with bulk discounts
 */
export function calculatePackagePrice(packageType: string, units: number = 1, hasContract: boolean = false, isReferral: boolean = false): ProjectPriceCalculation {
  const packageConfig = packagePricing[packageType as keyof typeof packagePricing];
  if (!packageConfig) {
    throw new Error(`Invalid package type: ${packageType}`);
  }

  let basePrice = packageConfig.basePrice * units;
  const breakdown = [{
    item: packageType.replace(/-/g, ' '),
    quantity: units,
    unitPrice: packageConfig.basePrice,
    total: basePrice
  }];

  // Calculate discounts
  const discounts = {
    bulkDiscount: 0,
    contractDiscount: 0,
    referralDiscount: 0,
    totalDiscount: 0
  };

  // Bulk discount only if package supports it
  if (packageConfig.bulkDiscount) {
    if (units >= 20) {
      discounts.bulkDiscount = basePrice * siteConfig.packages.discounts.largeDeveloper;
    } else if (units >= 5) {
      discounts.bulkDiscount = basePrice * siteConfig.packages.discounts.bulkProjects;
    }
  }

  // Contract customer discount
  if (hasContract) {
    discounts.contractDiscount = basePrice * siteConfig.packages.discounts.contractCustomer;
  }

  // Referral discount
  if (isReferral) {
    discounts.referralDiscount = basePrice * siteConfig.packages.discounts.referral;
  }

  discounts.totalDiscount = discounts.bulkDiscount + discounts.contractDiscount + discounts.referralDiscount;

  const totalPrice = basePrice - discounts.totalDiscount;

  return {
    basePrice,
    totalPrice,
    priceUnit: 'per package',
    discounts,
    surcharges: {
      totalSurcharge: 0
    },
    breakdown
  };
}

/**
 * Generate project quote based on assessment data
 */
export function generateProjectQuote(assessmentData: ProjectAssessmentData): {
  projectId: string;
  estimatedQuote: {
    min: number;
    max: number;
    currency: 'AED';
  };
  breakdown: ProjectPriceCalculation;
  recommendations: string[];
} {
  const projectId = `PROJ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Extract area from project size if available
  const areaMatch = assessmentData.projectSize.match(/(\d+)\s*sqm/i);
  const area = areaMatch ? parseInt(areaMatch[1]) : 0;
  
  // Extract units from project size if available
  const unitsMatch = assessmentData.projectSize.match(/(\d+)\s*unit/i);
  const units = unitsMatch ? parseInt(unitsMatch[1]) : 1;

  // Determine requirements based on project type
  let requirements = {};
  if (assessmentData.projectType === 'kitchen' && assessmentData.kitchenRequirements) {
    requirements = assessmentData.kitchenRequirements;
  } else if (assessmentData.projectType === 'bathroom' && assessmentData.bathroomRequirements) {
    requirements = assessmentData.bathroomRequirements;
  }

  // Calculate pricing
  const calculation = calculateProjectPrice({
    projectType: assessmentData.projectType,
    area,
    units,
    requirements,
    isUrgent: assessmentData.timeline?.toLowerCase().includes('urgent') || false,
    isWeekend: assessmentData.bestContactTime === 'weekend',
    hasContract: assessmentData.contactInfo.company !== undefined,
    isReferral: false // Would need to be determined from marketing source
  });

  // Generate price range (±20% for estimation)
  const minPrice = Math.round(calculation.totalPrice * 0.8);
  const maxPrice = Math.round(calculation.totalPrice * 1.2);

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (units >= 5) {
    recommendations.push(`Bulk discount available: Save up to ${formatPrice(calculation.discounts.bulkDiscount)} on ${units} units`);
  }
  
  if (assessmentData.contactInfo.company) {
    recommendations.push("Contract customer discount available for ongoing projects");
  }
  
  if (area > 100) {
    recommendations.push("Large area project - consider phased implementation for better scheduling");
  }
  
  recommendations.push("Site visit recommended for accurate quote and timeline");
  recommendations.push("All materials and labor included in quoted price");

  return {
    projectId,
    estimatedQuote: {
      min: minPrice,
      max: maxPrice,
      currency: 'AED'
    },
    breakdown: calculation,
    recommendations
  };
}

/**
 * Format price with currency
 */
export function formatPrice(price: number): string {
  return `AED ${price.toLocaleString()}`;
}

/**
 * Format price range
 */
export function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

/**
 * Get installment options for construction projects
 */
export function getProjectInstallmentOptions(totalPrice: number): Array<{ 
  description: string; 
  amount: number; 
  remaining: number;
  milestones?: string[];
}> {
  if (totalPrice < siteConfig.packages.installmentThreshold) {
    return [];
  }

  const advancePercentage = siteConfig.packages.advancePayment;
  const advance = Math.round(totalPrice * advancePercentage);
  const remaining = totalPrice - advance;

  const options = [
    {
      description: `${Math.round(advancePercentage * 100)}% Advance Payment`,
      amount: advance,
      remaining: remaining,
    }
  ];

  // Add milestone payment option for large projects
  if (totalPrice >= 10000 && siteConfig.packages.milestonePayments) {
    const milestonePayment = Math.round(remaining * 0.5);
    const finalPayment = remaining - milestonePayment;
    
    options.push({
      description: "Milestone-based Payment Plan",
      amount: advance,
      remaining: remaining,
      milestones: [
        `Advance: ${formatPrice(advance)}`,
        `50% completion: ${formatPrice(milestonePayment)}`,
        `Project completion: ${formatPrice(finalPayment)}`
      ]
    });
  }

  return options;
}

/**
 * Get service description for construction projects
 */
export function getConstructionServiceDescription(projectType: ProjectType): string {
  const service = siteConfig.services.constructionFinishing[projectType];
  return service ? service.description : `${projectType} construction finishing service`;
}

/**
 * Get bulk pricing tiers
 */
export function getBulkPricingTiers(): Array<{
  minUnits: number;
  discount: number;
  description: string;
}> {
  return [
    {
      minUnits: 5,
      discount: siteConfig.packages.discounts.bulkProjects,
      description: "5-19 units: 15% bulk discount"
    },
    {
      minUnits: 20,
      discount: siteConfig.packages.discounts.largeDeveloper,
      description: "20+ units: 20% developer discount"
    }
  ];
}

// Re-export configuration data for backward compatibility
export const timeSlots = siteConfig.operations.siteVisitSlots;
export const emirates = siteConfig.serviceAreas.emirates;
export const marketingSources = siteConfig.operations.marketingSources;
export const contactMethods = siteConfig.operations.contactMethods;
export const contactTimes = siteConfig.operations.contactTimes;
export const projectTypes = siteConfig.operations.projectTypes;
