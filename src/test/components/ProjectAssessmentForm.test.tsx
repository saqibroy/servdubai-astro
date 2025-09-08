import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectAssessmentForm from '@/components/react/ProjectAssessmentForm'

// Mock the validation schema
vi.mock('@/schemas/projectAssessmentValidation', () => ({
  projectAssessmentSchema: {
    parse: vi.fn(),
    safeParse: vi.fn(() => ({ success: true, data: {} }))
  },
  step1Schema: {
    parse: vi.fn(),
    safeParse: vi.fn(() => ({ success: true, data: {} }))
  },
  step2Schema: {
    parse: vi.fn(),
    safeParse: vi.fn(() => ({ success: true, data: {} }))
  },
  step3Schema: {
    parse: vi.fn(),
    safeParse: vi.fn(() => ({ success: true, data: {} }))
  },
  step4Schema: {
    parse: vi.fn(),
    safeParse: vi.fn(() => ({ success: true, data: {} }))
  },
  projectTypeOptions: [
    { value: 'kitchen', label: 'Kitchen Installation & Setup', description: 'Complete kitchen installation' },
    { value: 'bathroom', label: 'Bathroom Finishing Work', description: 'Fixture installations' },
    { value: 'flooring', label: 'Flooring & Tiling', description: 'Marble/granite installation' },
    { value: 'woodwork', label: 'Custom Woodwork', description: 'Built-in wardrobes' },
    { value: 'painting', label: 'Painting & Finishing', description: 'Interior wall painting' },
    { value: 'ac', label: 'AC Installation', description: 'Split AC installation' },
    { value: 'complete', label: 'Complete Building Finishing', description: 'Multiple services combined' }
  ],
  contactMethodOptions: [
    { value: 'whatsapp', label: 'WhatsApp consultation', description: 'Quick discussion via WhatsApp' },
    { value: 'phone', label: 'Phone call discussion', description: 'Detailed phone conversation' },
    { value: 'onsite', label: 'On-site visit and quote', description: 'Professional site visit' },
    { value: 'email', label: 'Email project details', description: 'Detailed project discussion' }
  ],
  contactTimeOptions: [
    { value: 'morning', label: 'Morning (9AM-12PM)', description: 'Best for site visits' },
    { value: 'afternoon', label: 'Afternoon (12PM-5PM)', description: 'Good for phone calls' },
    { value: 'evening', label: 'Evening (5PM-8PM)', description: 'Convenient for working professionals' },
    { value: 'weekend', label: 'Weekend availability needed', description: 'Saturday or Sunday contact' }
  ]
}))

describe('ProjectAssessmentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Multi-step Navigation', () => {
    it('should start on step 1 (Project Type Selection)', () => {
      render(<ProjectAssessmentForm />)
      
      expect(screen.getByText(/What type of construction finishing do you need/i)).toBeInTheDocument()
      expect(screen.getByText(/Kitchen Installation & Setup/i)).toBeInTheDocument()
      expect(screen.getByText(/Bathroom Finishing Work/i)).toBeInTheDocument()
    })

    it('should navigate to step 2 when project type is selected', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      // Select kitchen project type
      const kitchenOption = screen.getByLabelText(/Kitchen Installation & Setup/i)
      await user.click(kitchenOption)
      
      // Click next button
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Help us understand your project better/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Building name/i)).toBeInTheDocument()
      })
    })

    it('should navigate through all 4 steps', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      // Step 1: Select project type
      await user.click(screen.getByLabelText(/Kitchen Installation & Setup/i))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Step 2: Fill project details
      await waitFor(() => {
        expect(screen.getByLabelText(/Building name/i)).toBeInTheDocument()
      })
      
      await user.type(screen.getByLabelText(/Building name/i), 'Marina Heights Tower')
      await user.type(screen.getByLabelText(/Area/i), 'Dubai Marina')
      await user.type(screen.getByLabelText(/Project Size/i), '2 bedroom apartment')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Step 3: Project scope
      await waitFor(() => {
        expect(screen.getByText(/Project Specifications/i)).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Step 4: Contact details
      await waitFor(() => {
        expect(screen.getByText(/Let's discuss your project/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
      })
    })

    it('should allow going back to previous steps', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      // Navigate to step 2
      await user.click(screen.getByLabelText(/Kitchen Installation & Setup/i))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Building name/i)).toBeInTheDocument()
      })
      
      // Go back to step 1
      const backButton = screen.getByRole('button', { name: /back/i })
      await user.click(backButton)
      
      await waitFor(() => {
        expect(screen.getByText(/What type of construction finishing do you need/i)).toBeInTheDocument()
      })
    })
  })

  describe('Project Type Selection', () => {
    it('should display all 6 construction service options', () => {
      render(<ProjectAssessmentForm />)
      
      expect(screen.getByText(/Kitchen Installation & Setup/i)).toBeInTheDocument()
      expect(screen.getByText(/Bathroom Finishing Work/i)).toBeInTheDocument()
      expect(screen.getByText(/Flooring & Tiling/i)).toBeInTheDocument()
      expect(screen.getByText(/Custom Woodwork/i)).toBeInTheDocument()
      expect(screen.getByText(/Painting & Finishing/i)).toBeInTheDocument()
      expect(screen.getByText(/AC Installation/i)).toBeInTheDocument()
    })

    it('should show sub-services when project type is selected', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      await user.click(screen.getByLabelText(/Kitchen Installation & Setup/i))
      
      expect(screen.getByText(/Complete kitchen installation/i)).toBeInTheDocument()
      expect(screen.getByText(/Kitchen appliance connections/i)).toBeInTheDocument()
      expect(screen.getByText(/Cabinet and countertop work/i)).toBeInTheDocument()
    })

    it('should require project type selection before proceeding', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Should show validation error
      expect(screen.getByText(/Please select a project type/i)).toBeInTheDocument()
    })
  })

  describe('Image Upload Functionality', () => {
    it('should accept valid image files', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      // Navigate to step 2
      await user.click(screen.getByLabelText(/Kitchen Installation & Setup/i))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        const fileInput = screen.getByLabelText(/Upload Project Images/i)
        expect(fileInput).toBeInTheDocument()
      })
      
      const fileInput = screen.getByLabelText(/Upload Project Images/i) as HTMLInputElement
      const validFile = new File(['test'], 'project.jpg', { type: 'image/jpeg' })
      
      await user.upload(fileInput, validFile)
      
      expect(fileInput.files).toHaveLength(1)
      expect(fileInput.files![0]).toBe(validFile)
    })

    it('should reject files larger than 5MB', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      // Navigate to step 2
      await user.click(screen.getByLabelText(/Kitchen Installation & Setup/i))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        const fileInput = screen.getByLabelText(/Upload Project Images/i)
        expect(fileInput).toBeInTheDocument()
      })
      
      const fileInput = screen.getByLabelText(/Upload Project Images/i)
      // Create a large file (6MB)
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      
      await user.upload(fileInput, largeFile)
      
      expect(screen.getByText(/File size must be less than 5MB/i)).toBeInTheDocument()
    })

    it('should reject invalid file types', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      // Navigate to step 2
      await user.click(screen.getByLabelText(/Kitchen Installation & Setup/i))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        const fileInput = screen.getByLabelText(/Upload Project Images/i)
        expect(fileInput).toBeInTheDocument()
      })
      
      const fileInput = screen.getByLabelText(/Upload Project Images/i)
      const invalidFile = new File(['test'], 'document.doc', { type: 'application/msword' })
      
      await user.upload(fileInput, invalidFile)
      
      expect(screen.getByText(/Only JPG, PNG, and PDF files are allowed/i)).toBeInTheDocument()
    })

    it('should limit to maximum 10 files', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      // Navigate to step 2
      await user.click(screen.getByLabelText(/Kitchen Installation & Setup/i))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        const fileInput = screen.getByLabelText(/Upload Project Images/i)
        expect(fileInput).toBeInTheDocument()
      })
      
      const fileInput = screen.getByLabelText(/Upload Project Images/i)
      const files = Array.from({ length: 11 }, (_, i) => 
        new File(['test'], `file${i}.jpg`, { type: 'image/jpeg' })
      )
      
      await user.upload(fileInput, files)
      
      expect(screen.getByText(/Maximum 10 files allowed/i)).toBeInTheDocument()
    })
  })

  describe('Conditional Requirements Fields', () => {
    it('should show kitchen-specific requirements for kitchen projects', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      // Select kitchen project and navigate to step 3
      await user.click(screen.getByLabelText(/Kitchen Installation & Setup/i))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Fill step 2 minimally
      await waitFor(() => {
        expect(screen.getByLabelText(/Building name/i)).toBeInTheDocument()
      })
      await user.type(screen.getByLabelText(/Building name/i), 'Test Building')
      await user.type(screen.getByLabelText(/Area/i), 'Test Area')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Check kitchen requirements appear
      await waitFor(() => {
        expect(screen.getByText(/For Kitchen Projects/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Cabinet installation required/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Countertop installation/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Appliance connections needed/i)).toBeInTheDocument()
      })
    })

    it('should show bathroom-specific requirements for bathroom projects', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      // Select bathroom project and navigate to step 3
      await user.click(screen.getByLabelText(/Bathroom Finishing Work/i))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Fill step 2 minimally
      await waitFor(() => {
        expect(screen.getByLabelText(/Building name/i)).toBeInTheDocument()
      })
      await user.type(screen.getByLabelText(/Building name/i), 'Test Building')
      await user.type(screen.getByLabelText(/Area/i), 'Test Area')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Check bathroom requirements appear
      await waitFor(() => {
        expect(screen.getByText(/For Bathroom Projects/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Shower\/bathtub installation/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Toilet and sink installation/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Waterproofing needed/i)).toBeInTheDocument()
      })
    })

    it('should not show project-specific requirements for other project types', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      // Select flooring project and navigate to step 3
      await user.click(screen.getByLabelText(/Flooring & Tiling/i))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Fill step 2 minimally
      await waitFor(() => {
        expect(screen.getByLabelText(/Building name/i)).toBeInTheDocument()
      })
      await user.type(screen.getByLabelText(/Building name/i), 'Test Building')
      await user.type(screen.getByLabelText(/Area/i), 'Test Area')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Check no specific requirements appear
      await waitFor(() => {
        expect(screen.queryByText(/For Kitchen Projects/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/For Bathroom Projects/i)).not.toBeInTheDocument()
        expect(screen.getByLabelText(/Additional Details/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission and Error Handling', () => {
    it('should validate required fields before submission', async () => {
      const user = userEvent.setup()
      render(<ProjectAssessmentForm />)
      
      // Navigate to final step without filling required fields
      await user.click(screen.getByLabelText(/Kitchen Installation & Setup/i))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Skip step 2 validation by filling minimal required fields
      await waitFor(() => {
        expect(screen.getByLabelText(/Building name/i)).toBeInTheDocument()
      })
      await user.type(screen.getByLabelText(/Building name/i), 'Test')
      await user.type(screen.getByLabelText(/Area/i), 'Test')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Skip step 3
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
      })
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Try to submit without filling contact details
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /submit project assessment/i })).toBeInTheDocument()
      })
      await user.click(screen.getByRole('button', { name: /submit project assessment/i }))
      
      // Should show validation errors
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument()
    })

    it('should handle successful form submission', async () => {
      const user = userEvent.setup()
      
      // Mock successful API response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
      
      render(<ProjectAssessmentForm />)
      
      // Fill out complete form
      await user.click(screen.getByLabelText(/Kitchen Installation & Setup/i))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Step 2
      await waitFor(() => {
        expect(screen.getByLabelText(/Building name/i)).toBeInTheDocument()
      })
      await user.type(screen.getByLabelText(/Building name/i), 'Marina Heights')
      await user.type(screen.getByLabelText(/Area/i), 'Dubai Marina')
      await user.type(screen.getByLabelText(/Project Size/i), '2BR Apartment')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Step 3
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
      })
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Step 4
      await waitFor(() => {
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
      })
      await user.type(screen.getByLabelText(/Name/i), 'John Doe')
      await user.type(screen.getByLabelText(/Phone/i), '+971501234567')
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/Building name/i), 'Marina Heights')
      await user.type(screen.getByLabelText(/Area\/District/i), 'Dubai Marina')
      
      await user.click(screen.getByRole('button', { name: /submit project assessment/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/Project assessment submitted successfully/i)).toBeInTheDocument()
      })
    })

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup()
      
      // Mock API error
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
      
      render(<ProjectAssessmentForm />)
      
      // Fill out complete form and submit
      await user.click(screen.getByLabelText(/Kitchen Installation & Setup/i))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Building name/i)).toBeInTheDocument()
      })
      await user.type(screen.getByLabelText(/Building name/i), 'Test Building')
      await user.type(screen.getByLabelText(/Area/i), 'Test Area')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
      })
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
      })
      await user.type(screen.getByLabelText(/Name/i), 'John Doe')
      await user.type(screen.getByLabelText(/Phone/i), '+971501234567')
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/Building name/i), 'Test Building')
      await user.type(screen.getByLabelText(/Area\/District/i), 'Test Area')
      
      await user.click(screen.getByRole('button', { name: /submit project assessment/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to submit project assessment/i)).toBeInTheDocument()
      })
    })
  })
})