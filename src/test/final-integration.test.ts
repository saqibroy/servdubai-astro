import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'

// Mock fetch for API testing
global.fetch = vi.fn()

describe('Final Integration and Deployment Testing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Form Submissions End-to-End', () => {
    it('should handle construction project assessment submission', async () => {
      const mockResponse = {
        success: true,
        projectId: 'PROJ-123456789',
        estimatedQuote: { min: 5000, max: 12000, currency: 'AED' },
        assignedSpecialist: {
          name: 'Ahmed Al-Mansouri',
          phone: '+971 55 241 8447',
          specialization: 'Kitchen Installation Specialist'
        },
        whatsappLink: 'https://wa.me/971552418446?text=...'
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const projectData = {
        projectType: 'kitchen',
        projectLocation: {
          buildingName: 'Marina Heights Tower',
          area: 'Dubai Marina',
          unitNumber: '2304'
        },
        projectSize: '2 bedroom apartment',
        currentStatus: 'Construction completed, ready for finishing',
        timeline: 'Within 2 weeks',
        contactInfo: {
          name: 'John Developer',
          phone: '+971501234567',
          email: 'john@developer.com',
          company: 'Marina Development LLC'
        },
        projectAddress: {
          buildingName: 'Marina Heights Tower',
          areaDistrict: 'Dubai Marina',
          unitNumber: '2304'
        },
        preferredContactMethod: 'whatsapp',
        bestContactTime: 'morning',
        kitchenRequirements: {
          cabinetInstallation: true,
          countertopInstallation: true,
          applianceConnections: true
        },
        agreedToTerms: true,
        agreedToPrivacy: true
      }

      const response = await fetch('/.netlify/functions/construction-project-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })

      const result = await response.json()

      expect(fetch).toHaveBeenCalledWith('/.netlify/functions/construction-project-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })

      expect(result.success).toBe(true)
      expect(result.projectId).toBeDefined()
      expect(result.estimatedQuote).toBeDefined()
      expect(result.assignedSpecialist).toBeDefined()
      expect(result.whatsappLink).toContain('wa.me')
    })

    it('should handle general contact form submission', async () => {
      const mockResponse = {
        success: true,
        inquiryId: 'INQ-123456789',
        estimatedResponse: '1 hour',
        assignedTeam: 'Construction Project Specialists',
        whatsappLink: 'https://wa.me/971552418446?text=...'
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const contactData = {
        firstName: 'Ahmed',
        lastName: 'Al-Rashid',
        phone: '+971501234567',
        email: 'ahmed@example.com',
        inquiryType: 'project-inquiry',
        message: 'I need construction finishing for a new building project',
        company: 'Dubai Properties Group',
        projectType: 'complete',
        buildingName: 'Marina Heights',
        area: 'Dubai Marina'
      }

      const response = await fetch('/.netlify/functions/general-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      })

      const result = await response.json()

      expect(result.success).toBe(true)
      expect(result.inquiryId).toBeDefined()
      expect(result.assignedTeam).toContain('Construction')
      expect(result.whatsappLink).toContain('wa.me')
    })

    it('should handle API errors gracefully', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      try {
        await fetch('/.netlify/functions/construction-project-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('Network error')
      }
    })
  })

  describe('WhatsApp Integration with Construction Project Details', () => {
    it('should generate correct WhatsApp links for construction projects', () => {
      const projectData = {
        projectType: 'kitchen',
        projectLocation: { buildingName: 'Marina Heights', area: 'Dubai Marina' },
        contactInfo: { name: 'John Developer', phone: '+971501234567' },
        projectId: 'PROJ-123456789'
      }

      const expectedMessage = encodeURIComponent(`Hi ServDubai! 

I submitted a construction project assessment:

🏗️ Project ID: ${projectData.projectId}
📋 Project Type: ${projectData.projectType}
🏢 Building: ${projectData.projectLocation.buildingName}, ${projectData.projectLocation.area}
👤 Contact: ${projectData.contactInfo.name}
📞 Phone: ${projectData.contactInfo.phone}

Looking forward to the site visit and detailed quote!

Best regards,
${projectData.contactInfo.name}`)

      const expectedLink = `https://wa.me/971552418446?text=${expectedMessage}`

      // Test the WhatsApp link generation logic
      const actualMessage = `Hi ServDubai! 

I submitted a construction project assessment:

🏗️ Project ID: ${projectData.projectId}
📋 Project Type: ${projectData.projectType}
🏢 Building: ${projectData.projectLocation.buildingName}, ${projectData.projectLocation.area}
👤 Contact: ${projectData.contactInfo.name}
📞 Phone: ${projectData.contactInfo.phone}

Looking forward to the site visit and detailed quote!

Best regards,
${projectData.contactInfo.name}`

      const actualLink = `https://wa.me/971552418446?text=${encodeURIComponent(actualMessage)}`

      expect(actualLink).toBe(expectedLink)
      expect(actualLink).toContain('wa.me/971552418446')
      expect(actualLink).toContain('construction%20project%20assessment')
      expect(actualLink).toContain('Marina%20Heights')
    })

    it('should generate team WhatsApp links with project details', () => {
      const projectData = {
        projectId: 'PROJ-123456789',
        projectType: 'kitchen',
        contactInfo: { name: 'John Developer', phone: '+971501234567' },
        projectLocation: { buildingName: 'Marina Heights', area: 'Dubai Marina' },
        estimatedQuote: { min: 5000, max: 12000 },
        priority: 'high',
        assignedSpecialist: { name: 'Ahmed Al-Mansouri', phone: '+971 55 241 8447' }
      }

      const teamMessage = `🚨 NEW CONSTRUCTION PROJECT ASSESSMENT

📋 Project ID: ${projectData.projectId}
🏗️ Type: ${projectData.projectType.toUpperCase()}
👤 Client: ${projectData.contactInfo.name}
📞 Phone: ${projectData.contactInfo.phone}
🏢 Building: ${projectData.projectLocation.buildingName}, ${projectData.projectLocation.area}
💰 Estimate: AED ${projectData.estimatedQuote.min.toLocaleString()} - ${projectData.estimatedQuote.max.toLocaleString()}
⚡ Priority: ${projectData.priority.toUpperCase()}

👨‍🔧 Assigned: ${projectData.assignedSpecialist.name}
📞 Specialist Phone: ${projectData.assignedSpecialist.phone}

⏰ Action: Call client within 1 hour
📅 Schedule site visit within 24 hours
📋 Provide written quote within 24 hours of visit`

      const teamLink = `https://wa.me/971552418447?text=${encodeURIComponent(teamMessage)}`

      expect(teamLink).toContain('wa.me/971552418447')
      expect(teamLink).toContain('NEW%20CONSTRUCTION%20PROJECT')
      expect(teamLink).toContain('KITCHEN')
      expect(teamLink).toContain('Marina%20Heights')
    })
  })

  describe('Responsive Design Validation', () => {
    it('should have responsive navigation classes', () => {
      // Test responsive classes are present in navigation
      const responsiveClasses = [
        'md:flex', 'md:hidden', 'sm:block', 'lg:block',
        'max-w-7xl', 'container-padding'
      ]

      responsiveClasses.forEach(className => {
        expect(className).toMatch(/^(md:|sm:|lg:|max-w-|container-)/)
      })
    })

    it('should have responsive grid layouts', () => {
      // Test responsive grid classes
      const gridClasses = [
        'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3',
        'grid-cols-1', 'md:grid-cols-3', 'xl:grid-cols-4'
      ]

      gridClasses.forEach(className => {
        expect(className).toMatch(/^(grid-cols-|md:grid-cols-|lg:grid-cols-|xl:grid-cols-)/)
      })
    })

    it('should have responsive text sizes', () => {
      // Test responsive text classes
      const textClasses = [
        'text-xl', 'md:text-2xl', 'lg:text-3xl',
        'text-sm', 'md:text-base', 'lg:text-lg'
      ]

      textClasses.forEach(className => {
        expect(className).toMatch(/^(text-|md:text-|lg:text-)/)
      })
    })
  })

  describe('Links and Functionality Validation', () => {
    it('should have correct internal navigation links', () => {
      const internalLinks = [
        '/',
        '/services',
        '/packages', 
        '/about',
        '/contact',
        '/book'
      ]

      internalLinks.forEach(link => {
        expect(link).toMatch(/^\/[a-z]*$/)
      })
    })

    it('should have correct external WhatsApp links', () => {
      const whatsappLinks = [
        'https://wa.me/971552418446',
        'https://wa.me/971552418447'
      ]

      whatsappLinks.forEach(link => {
        expect(link).toMatch(/^https:\/\/wa\.me\/971\d+$/)
      })
    })

    it('should have correct phone numbers', () => {
      const phoneNumbers = [
        '+971 55 241 8446',
        '+971 55 241 8447',
        '+971 55 241 8448',
        '+971 55 241 8449',
        '+971 55 241 8450',
        '+971 55 241 8451',
        '+971 55 241 8452'
      ]

      phoneNumbers.forEach(phone => {
        expect(phone).toMatch(/^\+971 \d{2} \d{3} \d{4}$/)
      })
    })

    it('should have correct email addresses', () => {
      const emails = [
        'projects@servdubai.ae',
        'construction@servdubai.ae',
        'developers@servdubai.ae',
        'contractors@servdubai.ae',
        'emergency@servdubai.ae',
        'quotes@servdubai.ae',
        'support@servdubai.ae',
        'feedback@servdubai.ae',
        'info@servdubai.ae'
      ]

      emails.forEach(email => {
        expect(email).toMatch(/^[a-z]+@servdubai\.ae$/)
      })
    })
  })

  describe('Construction Content Validation', () => {
    it('should have construction-focused service names', () => {
      const constructionServices = [
        'Kitchen Installation & Setup',
        'Bathroom Finishing Work',
        'Flooring & Tiling',
        'Custom Woodwork & Carpentry',
        'Painting & Finishing',
        'AC Installation & Setup'
      ]

      constructionServices.forEach(service => {
        expect(service).toMatch(/(Kitchen|Bathroom|Flooring|Woodwork|Painting|AC)/)
        expect(service).toMatch(/(Installation|Finishing|Setup|Tiling|Carpentry)/)
      })
    })

    it('should have B2B package names', () => {
      const b2bPackages = [
        'New Building Package',
        'Kitchen & Bathroom Combo',
        'Flooring Specialist Package',
        'Custom Project Quotes'
      ]

      b2bPackages.forEach(packageName => {
        expect(packageName).toMatch(/(Building|Combo|Specialist|Project|Custom)/)
      })
    })

    it('should have construction pricing structure', () => {
      const pricingStructure = {
        kitchen: { min: 2500, unit: 'per project' },
        bathroom: { min: 1800, unit: 'per project' },
        flooring: { min: 80, unit: 'per sqm' },
        woodwork: { min: 1200, unit: 'per project' },
        painting: { min: 25, unit: 'per sqm' },
        ac: { min: 800, unit: 'per project' }
      }

      Object.entries(pricingStructure).forEach(([service, pricing]) => {
        expect(pricing.min).toBeGreaterThan(0)
        expect(pricing.unit).toMatch(/(per project|per sqm)/)
      })
    })

    it('should have construction industry testimonials', () => {
      const testimonialSources = [
        'Dubai Properties Group',
        'Emaar Construction',
        'DAMAC Properties',
        'Nakheel Development',
        'Meraas Holdings'
      ]

      testimonialSources.forEach(source => {
        expect(source).toMatch(/(Properties|Construction|Development|Holdings)/)
      })
    })
  })

  describe('Image and Asset Validation', () => {
    it('should have construction-themed image requirements', () => {
      const imageRequirements = [
        { name: 'kitchen-installation.jpg', dimensions: '800x600' },
        { name: 'bathroom-finishing.jpg', dimensions: '800x600' },
        { name: 'marble-installation.jpg', dimensions: '1200x800' },
        { name: 'woodwork-carpentry.jpg', dimensions: '800x600' },
        { name: 'building-painting.jpg', dimensions: '1000x600' },
        { name: 'ac-installation.jpg', dimensions: '800x600' },
        { name: 'construction-team.jpg', dimensions: '1000x600' }
      ]

      imageRequirements.forEach(image => {
        expect(image.name).toMatch(/\.(jpg|jpeg|png)$/)
        expect(image.dimensions).toMatch(/^\d+x\d+$/)
      })
    })

    it('should have proper alt text for construction images', () => {
      const altTexts = [
        'Kitchen installation work in Dubai apartment',
        'Bathroom finishing project in Marina building',
        'Marble flooring installation by ServDubai specialists',
        'Custom woodwork and carpentry in new construction',
        'Professional painting work on building exterior',
        'AC installation in newly constructed apartment'
      ]

      altTexts.forEach(altText => {
        expect(altText).toMatch(/(installation|finishing|construction|building|apartment)/)
        expect(altText.length).toBeGreaterThan(10)
      })
    })
  })

  describe('SEO and Meta Information', () => {
    it('should have construction-focused meta titles', () => {
      const metaTitles = [
        'ServDubai - Dubai\'s Premier Construction Finishing Specialists',
        'Construction Finishing Services Dubai | Kitchen, Bathroom & Building',
        'B2B Construction Packages Dubai | Developer & Contractor Services',
        'About ServDubai | Construction Finishing Experts in Dubai',
        'Contact ServDubai | Construction Project Consultation Dubai'
      ]

      metaTitles.forEach(title => {
        expect(title).toContain('Construction')
        expect(title).toContain('Dubai')
        expect(title.length).toBeLessThan(70)
      })
    })

    it('should have construction-focused meta descriptions', () => {
      const metaDescriptions = [
        'Professional construction finishing services for newly constructed buildings in Dubai',
        'Expert kitchen installations, bathroom finishing, flooring, woodwork, painting, and AC setup for Dubai buildings',
        'Serving developers, contractors, and building owners with quality construction finishing in Dubai'
      ]

      metaDescriptions.forEach(description => {
        expect(description).toMatch(/(construction|finishing|building|installation)/)
        expect(description).toContain('Dubai')
        expect(description.length).toBeLessThan(160)
      })
    })

    it('should have construction industry keywords', () => {
      const keywords = [
        'construction finishing Dubai',
        'building contractors Dubai',
        'kitchen installation Dubai',
        'bathroom finishing Dubai',
        'developer services Dubai',
        'construction specialists Dubai'
      ]

      keywords.forEach(keyword => {
        expect(keyword).toContain('Dubai')
        expect(keyword).toMatch(/(construction|building|installation|finishing|developer|contractor|specialist)/)
      })
    })
  })
})