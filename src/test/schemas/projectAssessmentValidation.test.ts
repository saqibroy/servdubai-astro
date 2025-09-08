import { describe, it, expect } from 'vitest'
import { projectAssessmentSchema } from '@/schemas/projectAssessmentValidation'

describe('Project Assessment Validation Schema', () => {
  describe('Project Type Validation', () => {
    it('should accept valid project types', () => {
      const validTypes = ['kitchen', 'bathroom', 'flooring', 'woodwork', 'painting', 'ac', 'complete']
      
      validTypes.forEach(type => {
        const result = projectAssessmentSchema.safeParse({
          projectType: type,
          projectLocation: {
            buildingName: 'Test Building',
            area: 'Test Area'
          },
          projectSize: 'Test Size',
          currentStatus: 'Test Status',
          timeline: 'Test Timeline',
          contactInfo: {
            name: 'John Doe',
            phone: '+971501234567',
            email: 'john@example.com'
          },
          projectAddress: {
            buildingName: 'Test Building',
            areaDistrict: 'Test Area'
          },
          preferredContactMethod: 'whatsapp',
          bestContactTime: 'morning'
        })
        
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid project types', () => {
      const result = projectAssessmentSchema.safeParse({
        projectType: 'invalid-type',
        projectLocation: {
          buildingName: 'Test Building',
          area: 'Test Area'
        },
        contactInfo: {
          name: 'John Doe',
          phone: '+971501234567',
          email: 'john@example.com'
        }
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('projectType')
      }
    })
  })

  describe('Project Location Validation', () => {
    it('should require building name and area', () => {
      const result = projectAssessmentSchema.safeParse({
        projectType: 'kitchen',
        projectLocation: {
          buildingName: '',
          area: ''
        },
        contactInfo: {
          name: 'John Doe',
          phone: '+971501234567',
          email: 'john@example.com'
        }
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.issues.map(issue => issue.path.join('.'))
        expect(errors).toContain('projectLocation.buildingName')
        expect(errors).toContain('projectLocation.area')
      }
    })

    it('should accept optional unit number', () => {
      const result = projectAssessmentSchema.safeParse({
        projectType: 'kitchen',
        projectLocation: {
          buildingName: 'Test Building',
          area: 'Test Area',
          unitNumber: '1205'
        },
        projectSize: 'Test Size',
        currentStatus: 'Test Status',
        timeline: 'Test Timeline',
        contactInfo: {
          name: 'John Doe',
          phone: '+971501234567',
          email: 'john@example.com'
        },
        projectAddress: {
          buildingName: 'Test Building',
          areaDistrict: 'Test Area'
        },
        preferredContactMethod: 'whatsapp',
        bestContactTime: 'morning'
      })
      
      expect(result.success).toBe(true)
    })
  })

  describe('File Upload Validation', () => {
    it('should accept up to 10 files', () => {
      const files = Array.from({ length: 10 }, (_, i) => 
        new File(['test'], `file${i}.jpg`, { type: 'image/jpeg' })
      )
      
      const result = projectAssessmentSchema.safeParse({
        projectType: 'kitchen',
        projectLocation: {
          buildingName: 'Test Building',
          area: 'Test Area'
        },
        projectSize: 'Test Size',
        currentStatus: 'Test Status',
        timeline: 'Test Timeline',
        projectImages: files,
        contactInfo: {
          name: 'John Doe',
          phone: '+971501234567',
          email: 'john@example.com'
        },
        projectAddress: {
          buildingName: 'Test Building',
          areaDistrict: 'Test Area'
        },
        preferredContactMethod: 'whatsapp',
        bestContactTime: 'morning'
      })
      
      expect(result.success).toBe(true)
    })

    it('should reject more than 10 files', () => {
      const files = Array.from({ length: 11 }, (_, i) => 
        new File(['test'], `file${i}.jpg`, { type: 'image/jpeg' })
      )
      
      const result = projectAssessmentSchema.safeParse({
        projectType: 'kitchen',
        projectImages: files,
        contactInfo: {
          name: 'John Doe',
          phone: '+971501234567',
          email: 'john@example.com'
        }
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('projectImages')
        expect(result.error.issues[0].message).toContain('10')
      }
    })
  })

  describe('Contact Information Validation', () => {
    it('should require name, phone, and email', () => {
      const result = projectAssessmentSchema.safeParse({
        projectType: 'kitchen',
        contactInfo: {
          name: '',
          phone: '',
          email: ''
        }
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.issues.map(issue => issue.path.join('.'))
        expect(errors).toContain('contactInfo.name')
        expect(errors).toContain('contactInfo.phone')
        expect(errors).toContain('contactInfo.email')
      }
    })

    it('should validate email format', () => {
      const result = projectAssessmentSchema.safeParse({
        projectType: 'kitchen',
        contactInfo: {
          name: 'John Doe',
          phone: '+971501234567',
          email: 'invalid-email'
        }
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email')
        expect(result.error.issues[0].message).toContain('email')
      }
    })

    it('should accept optional company field', () => {
      const result = projectAssessmentSchema.safeParse({
        projectType: 'kitchen',
        projectLocation: {
          buildingName: 'Test Building',
          area: 'Test Area'
        },
        projectSize: 'Test Size',
        currentStatus: 'Test Status',
        timeline: 'Test Timeline',
        contactInfo: {
          name: 'John Doe',
          phone: '+971501234567',
          email: 'john@example.com',
          company: 'ABC Construction'
        },
        projectAddress: {
          buildingName: 'Test Building',
          areaDistrict: 'Test Area'
        },
        preferredContactMethod: 'whatsapp',
        bestContactTime: 'morning'
      })
      
      expect(result.success).toBe(true)
    })
  })

  describe('Contact Method Validation', () => {
    it('should accept valid contact methods', () => {
      const validMethods = ['whatsapp', 'phone', 'onsite', 'email']
      
      validMethods.forEach(method => {
        const result = projectAssessmentSchema.safeParse({
          projectType: 'kitchen',
          projectLocation: {
            buildingName: 'Test Building',
            area: 'Test Area'
          },
          projectSize: 'Test Size',
          currentStatus: 'Test Status',
          timeline: 'Test Timeline',
          contactInfo: {
            name: 'John Doe',
            phone: '+971501234567',
            email: 'john@example.com'
          },
          projectAddress: {
            buildingName: 'Test Building',
            areaDistrict: 'Test Area'
          },
          preferredContactMethod: method,
          bestContactTime: 'morning'
        })
        
        expect(result.success).toBe(true)
      })
    })

    it('should accept valid contact times', () => {
      const validTimes = ['morning', 'afternoon', 'evening', 'weekend']
      
      validTimes.forEach(time => {
        const result = projectAssessmentSchema.safeParse({
          projectType: 'kitchen',
          projectLocation: {
            buildingName: 'Test Building',
            area: 'Test Area'
          },
          projectSize: 'Test Size',
          currentStatus: 'Test Status',
          timeline: 'Test Timeline',
          contactInfo: {
            name: 'John Doe',
            phone: '+971501234567',
            email: 'john@example.com'
          },
          projectAddress: {
            buildingName: 'Test Building',
            areaDistrict: 'Test Area'
          },
          preferredContactMethod: 'whatsapp',
          bestContactTime: time
        })
        
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Conditional Requirements Validation', () => {
    it('should accept kitchen requirements when project type is kitchen', () => {
      const result = projectAssessmentSchema.safeParse({
        projectType: 'kitchen',
        projectLocation: {
          buildingName: 'Test Building',
          area: 'Test Area'
        },
        projectSize: 'Test Size',
        currentStatus: 'Test Status',
        timeline: 'Test Timeline',
        kitchenRequirements: {
          cabinetInstallation: true,
          countertopInstallation: true,
          applianceConnections: false,
          plumbingWork: true,
          electricalConnections: true,
          customStorage: false
        },
        contactInfo: {
          name: 'John Doe',
          phone: '+971501234567',
          email: 'john@example.com'
        },
        projectAddress: {
          buildingName: 'Test Building',
          areaDistrict: 'Test Area'
        },
        preferredContactMethod: 'whatsapp',
        bestContactTime: 'morning'
      })
      
      expect(result.success).toBe(true)
    })

    it('should accept bathroom requirements when project type is bathroom', () => {
      const result = projectAssessmentSchema.safeParse({
        projectType: 'bathroom',
        projectLocation: {
          buildingName: 'Test Building',
          area: 'Test Area'
        },
        projectSize: 'Test Size',
        currentStatus: 'Test Status',
        timeline: 'Test Timeline',
        bathroomRequirements: {
          showerBathtubInstallation: true,
          toiletSinkInstallation: true,
          tileMarbleInstallation: false,
          plumbingConnections: true,
          mirrorCabinetInstallation: false,
          waterproofing: true
        },
        contactInfo: {
          name: 'John Doe',
          phone: '+971501234567',
          email: 'john@example.com'
        },
        projectAddress: {
          buildingName: 'Test Building',
          areaDistrict: 'Test Area'
        },
        preferredContactMethod: 'whatsapp',
        bestContactTime: 'morning'
      })
      
      expect(result.success).toBe(true)
    })
  })
})