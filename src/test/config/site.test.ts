import { describe, it, expect } from 'vitest'
import { siteConfig } from '@/config/site'

describe('Site Configuration Content Transformation', () => {
  describe('Business Information', () => {
    it('should have construction finishing business tagline', () => {
      expect(siteConfig.business.tagline).toContain('Construction Finishing')
      expect(siteConfig.business.tagline).toContain('Dubai')
    })

    it('should have construction-focused business description', () => {
      expect(siteConfig.business.description).toContain('construction finishing')
      expect(siteConfig.business.description).toContain('newly constructed buildings')
      expect(siteConfig.business.description).toContain('developers')
      expect(siteConfig.business.description).toContain('contractors')
    })

    it('should target B2B construction market', () => {
      expect(siteConfig.business.targetMarket).toContain('Construction companies')
      expect(siteConfig.business.targetMarket).toContain('Real estate developers')
      expect(siteConfig.business.targetMarket).toContain('Building contractors')
      expect(siteConfig.business.targetMarket).toContain('Property management companies')
    })

    it('should not contain residential maintenance messaging', () => {
      expect(siteConfig.business.description).not.toContain('cleaning')
      expect(siteConfig.business.description).not.toContain('maintenance')
      expect(siteConfig.business.tagline).not.toContain('maintenance')
    })
  })

  describe('Construction Services', () => {
    it('should have all 6 construction finishing services', () => {
      const services = siteConfig.services.constructionFinishing
      
      expect(services.kitchen).toBeDefined()
      expect(services.bathroom).toBeDefined()
      expect(services.flooring).toBeDefined()
      expect(services.woodwork).toBeDefined()
      expect(services.painting).toBeDefined()
      expect(services.ac).toBeDefined()
    })

    it('should have correct service names and descriptions', () => {
      const services = siteConfig.services.constructionFinishing
      
      expect(services.kitchen.name).toBe('Kitchen Finishing Projects')
      expect(services.bathroom.name).toBe('Bathroom Construction Completion')
      expect(services.flooring.name).toBe('Flooring & Tiling Specialists')
      expect(services.woodwork.name).toBe('Custom Woodwork & Carpentry')
      expect(services.painting.name).toBe('Building Painting & Finishing')
      expect(services.ac.name).toBe('AC Installation & Setup')
    })

    it('should have correct starting prices', () => {
      const services = siteConfig.services.constructionFinishing
      
      expect(services.kitchen.startingPrice).toBe(2500)
      expect(services.bathroom.startingPrice).toBe(1800)
      expect(services.flooring.startingPrice).toBe(80)
      expect(services.woodwork.startingPrice).toBe(1200)
      expect(services.painting.startingPrice).toBe(25)
      expect(services.ac.startingPrice).toBe(800)
    })

    it('should have correct pricing units', () => {
      const services = siteConfig.services.constructionFinishing
      
      expect(services.flooring.priceUnit).toBe('per sqm')
      expect(services.painting.priceUnit).toBe('per sqm')
      // Other services should default to per project
    })

    it('should target construction industry audiences', () => {
      const services = siteConfig.services.constructionFinishing
      
      expect(services.kitchen.targetAudience).toContain('Developers')
      expect(services.bathroom.targetAudience).toContain('Construction companies')
      expect(services.flooring.targetAudience).toContain('Building developers')
      expect(services.woodwork.targetAudience).toContain('Property developers')
    })
  })

  describe('B2B Package Structure', () => {
    it('should have all B2B construction packages', () => {
      const packages = siteConfig.packages
      
      expect(packages.newBuildingPackage).toBeDefined()
      expect(packages.kitchenBathroomCombo).toBeDefined()
      expect(packages.flooringSpecialist).toBeDefined()
      expect(packages.customProjectQuotes).toBeDefined()
    })

    it('should have correct package price ranges', () => {
      const packages = siteConfig.packages
      
      expect(packages.newBuildingPackage.priceRange).toEqual([8000, 15000])
      expect(packages.kitchenBathroomCombo.priceRange).toEqual([4500, 8000])
      expect(packages.flooringSpecialist.priceRange).toEqual([3000, 6000])
    })

    it('should target construction industry market', () => {
      const packages = siteConfig.packages
      
      expect(packages.newBuildingPackage.targetMarket).toContain('Real estate developers')
      expect(packages.kitchenBathroomCombo.targetMarket).toContain('small developers')
      expect(packages.flooringSpecialist.targetMarket).toContain('Construction companies')
      expect(packages.customProjectQuotes.targetMarket).toContain('construction industry')
    })

    it('should have construction-focused package features', () => {
      const packages = siteConfig.packages
      
      expect(packages.newBuildingPackage.features).toContain('Bulk pricing for multiple units')
      expect(packages.newBuildingPackage.features).toContain('Flexible timeline to match construction schedules')
      expect(packages.customProjectQuotes.features).toContain('Site visit and detailed assessment')
    })
  })

  describe('Service Areas', () => {
    it('should cover major Dubai construction areas', () => {
      const serviceAreas = siteConfig.business.serviceAreas
      
      expect(serviceAreas).toContain('Dubai Marina')
      expect(serviceAreas).toContain('Downtown Dubai')
      expect(serviceAreas).toContain('Business Bay')
      expect(serviceAreas).toContain('DIFC')
      expect(serviceAreas).toContain('Dubai Hills')
    })

    it('should have comprehensive Dubai coverage', () => {
      const serviceAreas = siteConfig.business.serviceAreas
      
      expect(serviceAreas.length).toBeGreaterThanOrEqual(8)
      expect(serviceAreas.every(area => area.includes('Dubai') || area.includes('Al '))).toBe(true)
    })
  })
})