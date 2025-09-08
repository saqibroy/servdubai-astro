import { describe, it, expect } from 'vitest';
import {
  calculateProjectPrice,
  calculatePackagePrice,
  generateProjectQuote,
  formatPrice,
  formatPriceRange,
  getProjectInstallmentOptions,
  getBulkPricingTiers,
  constructionPricing
} from '../../utils/pricing';
import type { ProjectAssessmentData } from '../../types/projectAssessment';

describe('Construction Project Pricing Utilities', () => {
  describe('calculateProjectPrice', () => {
    it('should calculate basic kitchen project price', () => {
      const result = calculateProjectPrice({
        projectType: 'kitchen',
        units: 1
      });

      expect(result.basePrice).toBe(2500);
      expect(result.totalPrice).toBe(2500);
      expect(result.priceUnit).toBe('per project');
      expect(result.breakdown).toHaveLength(1);
      expect(result.breakdown[0].item).toBe('kitchen (per project)');
    });

    it('should calculate flooring price per sqm', () => {
      const result = calculateProjectPrice({
        projectType: 'flooring',
        area: 100
      });

      expect(result.basePrice).toBe(8000); // 80 * 100
      expect(result.totalPrice).toBe(8000);
      expect(result.priceUnit).toBe('per sqm');
      expect(result.breakdown[0].quantity).toBe(100);
    });

    it('should apply bulk discount for multiple units', () => {
      const result = calculateProjectPrice({
        projectType: 'kitchen',
        units: 10
      });

      expect(result.basePrice).toBe(25000); // 2500 * 10
      expect(result.discounts.bulkDiscount).toBe(3750); // 15% of 25000
      expect(result.totalPrice).toBe(21250); // 25000 - 3750
    });

    it('should apply large developer discount for 20+ units', () => {
      const result = calculateProjectPrice({
        projectType: 'bathroom',
        units: 25
      });

      expect(result.basePrice).toBe(45000); // 1800 * 25
      expect(result.discounts.bulkDiscount).toBe(9000); // 20% of 45000
      expect(result.totalPrice).toBe(36000);
    });

    it('should add component pricing based on requirements', () => {
      const result = calculateProjectPrice({
        projectType: 'kitchen',
        units: 1,
        requirements: {
          cabinetInstallation: true,
          countertopInstallation: true,
          applianceConnections: false
        }
      });

      expect(result.basePrice).toBe(3900); // 2500 + 800 + 600
      expect(result.breakdown).toHaveLength(3);
    });

    it('should apply surcharges for urgent projects', () => {
      const result = calculateProjectPrice({
        projectType: 'kitchen',
        units: 1,
        isUrgent: true,
        isWeekend: true
      });

      expect(result.surcharges.urgentProject).toBe(200);
      expect(result.surcharges.weekend).toBe(100);
      expect(result.surcharges.totalSurcharge).toBe(300);
      expect(result.totalPrice).toBe(2800); // 2500 + 300
    });

    it('should apply contract and referral discounts', () => {
      const result = calculateProjectPrice({
        projectType: 'kitchen',
        units: 1,
        hasContract: true,
        isReferral: true
      });

      expect(result.discounts.contractDiscount).toBe(250); // 10% of 2500
      expect(result.discounts.referralDiscount).toBe(125); // 5% of 2500
      expect(result.totalPrice).toBe(2125); // 2500 - 375
    });
  });

  describe('calculatePackagePrice', () => {
    it('should calculate new building package price', () => {
      const result = calculatePackagePrice('new-building-package', 1);

      expect(result.basePrice).toBe(8000);
      expect(result.totalPrice).toBe(8000);
      expect(result.breakdown[0].item).toBe('new building package');
    });

    it('should apply bulk discount for packages that support it', () => {
      const result = calculatePackagePrice('new-building-package', 10);

      expect(result.basePrice).toBe(80000);
      expect(result.discounts.bulkDiscount).toBe(12000); // 15% of 80000
      expect(result.totalPrice).toBe(68000);
    });

    it('should not apply bulk discount for packages that do not support it', () => {
      const result = calculatePackagePrice('kitchen-bathroom-combo', 10);

      expect(result.basePrice).toBe(45000);
      expect(result.discounts.bulkDiscount).toBe(0);
      expect(result.totalPrice).toBe(45000);
    });
  });

  describe('generateProjectQuote', () => {
    const mockAssessmentData: ProjectAssessmentData = {
      projectType: 'kitchen',
      projectLocation: {
        buildingName: 'Marina Heights',
        area: 'Dubai Marina'
      },
      projectSize: '50 sqm, 1 unit',
      currentStatus: 'Ready for finishing',
      timeline: 'Within 2 weeks',
      projectImages: [],
      kitchenRequirements: {
        cabinetInstallation: true,
        countertopInstallation: true
      },
      additionalDetails: '',
      contactInfo: {
        name: 'John Doe',
        phone: '+971501234567',
        email: 'john@example.com',
        company: 'ABC Development'
      },
      projectAddress: {
        buildingName: 'Marina Heights',
        areaDistrict: 'Dubai Marina'
      },
      preferredContactMethod: 'whatsapp',
      bestContactTime: 'morning'
    };

    it('should generate project quote with price range', () => {
      const result = generateProjectQuote(mockAssessmentData);

      expect(result.projectId).toMatch(/^PROJ-\d+-[a-z0-9]+$/);
      expect(result.estimatedQuote.currency).toBe('AED');
      expect(result.estimatedQuote.min).toBeGreaterThan(0);
      expect(result.estimatedQuote.max).toBeGreaterThan(result.estimatedQuote.min);
      expect(result.breakdown.basePrice).toBeGreaterThan(0);
      expect(result.recommendations).toBeInstanceOf(Array);
    });

    it('should include bulk discount recommendation for multiple units', () => {
      const assessmentWithMultipleUnits = {
        ...mockAssessmentData,
        projectSize: '500 sqm, 10 units'
      };

      const result = generateProjectQuote(assessmentWithMultipleUnits);
      
      expect(result.recommendations.some(rec => 
        rec.includes('Bulk discount available')
      )).toBe(true);
    });

    it('should include contract discount recommendation for company clients', () => {
      const result = generateProjectQuote(mockAssessmentData);
      
      expect(result.recommendations.some(rec => 
        rec.includes('Contract customer discount')
      )).toBe(true);
    });
  });

  describe('formatPrice', () => {
    it('should format price with AED currency', () => {
      expect(formatPrice(2500)).toBe('AED 2,500');
      expect(formatPrice(15000)).toBe('AED 15,000');
      expect(formatPrice(125000)).toBe('AED 125,000');
    });
  });

  describe('formatPriceRange', () => {
    it('should format price range correctly', () => {
      expect(formatPriceRange(2500, 8000)).toBe('AED 2,500 - AED 8,000');
      expect(formatPriceRange(10000, 25000)).toBe('AED 10,000 - AED 25,000');
    });
  });

  describe('getProjectInstallmentOptions', () => {
    it('should return empty array for amounts below threshold', () => {
      const result = getProjectInstallmentOptions(3000);
      expect(result).toHaveLength(0);
    });

    it('should return advance payment option for amounts above threshold', () => {
      const result = getProjectInstallmentOptions(8000); // Use amount below 10000 to get only 1 option
      
      expect(result).toHaveLength(1);
      expect(result[0].description).toContain('40% Advance Payment');
      expect(result[0].amount).toBe(3200);
      expect(result[0].remaining).toBe(4800);
    });

    it('should include milestone payment option for large projects', () => {
      const result = getProjectInstallmentOptions(15000);
      
      expect(result).toHaveLength(2);
      expect(result[1].description).toBe('Milestone-based Payment Plan');
      expect(result[1].milestones).toHaveLength(3);
    });
  });

  describe('getBulkPricingTiers', () => {
    it('should return correct bulk pricing tiers', () => {
      const tiers = getBulkPricingTiers();
      
      expect(tiers).toHaveLength(2);
      expect(tiers[0].minUnits).toBe(5);
      expect(tiers[0].discount).toBe(0.15);
      expect(tiers[1].minUnits).toBe(20);
      expect(tiers[1].discount).toBe(0.20);
    });
  });

  describe('constructionPricing configuration', () => {
    it('should have pricing for all project types', () => {
      const projectTypes = ['kitchen', 'bathroom', 'flooring', 'woodwork', 'painting', 'ac'];
      
      projectTypes.forEach(type => {
        expect(constructionPricing[type as keyof typeof constructionPricing]).toBeDefined();
        expect(constructionPricing[type as keyof typeof constructionPricing].basePrice).toBeGreaterThan(0);
        expect(constructionPricing[type as keyof typeof constructionPricing].priceRange).toHaveLength(2);
      });
    });

    it('should have components for detailed pricing', () => {
      expect(constructionPricing.kitchen.components.cabinetInstallation).toBe(800);
      expect(constructionPricing.bathroom.components.tileMarbleInstallation).toBe(500);
      expect(constructionPricing.flooring.components.marbleInstallation).toBe(120);
    });
  });
});