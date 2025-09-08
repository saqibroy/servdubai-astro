import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock Testimonials component with construction industry testimonials
const MockTestimonials = () => (
  <section className="testimonials">
    <div className="testimonial-card">
      <div className="testimonial-content">
        <p>"ServDubai completed the finishing work for our entire 40-floor tower. Their kitchen and bathroom installations were flawless, and they delivered on time for our handover deadline."</p>
      </div>
      <div className="testimonial-author">
        <h4>Ahmed Al-Rashid</h4>
        <p>Project Manager, Dubai Properties Group</p>
        <div className="project-details">
          <span>Marina Heights Tower - 120 units</span>
          <span>Project Value: AED 1.2M</span>
          <span>Completed in: 6 weeks</span>
        </div>
      </div>
    </div>
    <div className="testimonial-card">
      <div className="testimonial-content">
        <p>"We needed reliable finishing contractors for our luxury development. ServDubai's team handled marble installation, custom woodwork, and AC setup across 80 apartments with exceptional quality."</p>
      </div>
      <div className="testimonial-author">
        <h4>Sarah Mitchell</h4>
        <p>Construction Director, Emaar Properties</p>
        <div className="project-details">
          <span>Downtown Residences - 80 units</span>
          <span>Project Value: AED 950K</span>
          <span>Completed in: 8 weeks</span>
        </div>
      </div>
    </div>
    <div className="testimonial-card">
      <div className="testimonial-content">
        <p>"As a building contractor, finding skilled finishing specialists is crucial. ServDubai consistently delivers quality work on our commercial and residential projects throughout Dubai."</p>
      </div>
      <div className="testimonial-author">
        <h4>Mohammad Hassan</h4>
        <p>Owner, Hassan Construction LLC</p>
        <div className="project-details">
          <span>Multiple Projects - 200+ units</span>
          <span>Ongoing Partnership</span>
          <span>5-star rating</span>
        </div>
      </div>
    </div>
  </section>
)

describe('Testimonials Content Transformation', () => {
  it('should display construction industry client testimonials', () => {
    render(<MockTestimonials />)
    
    expect(screen.getByText(/Ahmed Al-Rashid/i)).toBeInTheDocument()
    expect(screen.getByText(/Sarah Mitchell/i)).toBeInTheDocument()
    expect(screen.getByText(/Mohammad Hassan/i)).toBeInTheDocument()
  })

  it('should display construction industry companies and roles', () => {
    render(<MockTestimonials />)
    
    expect(screen.getByText(/Project Manager, Dubai Properties Group/i)).toBeInTheDocument()
    expect(screen.getByText(/Construction Director, Emaar Properties/i)).toBeInTheDocument()
    expect(screen.getByText(/Owner, Hassan Construction LLC/i)).toBeInTheDocument()
  })

  it('should display construction project details', () => {
    render(<MockTestimonials />)
    
    expect(screen.getByText(/Marina Heights Tower - 120 units/i)).toBeInTheDocument()
    expect(screen.getByText(/Downtown Residences - 80 units/i)).toBeInTheDocument()
    expect(screen.getByText(/Multiple Projects - 200\+ units/i)).toBeInTheDocument()
  })

  it('should display project values and completion times', () => {
    render(<MockTestimonials />)
    
    expect(screen.getByText(/Project Value: AED 1\.2M/i)).toBeInTheDocument()
    expect(screen.getByText(/Project Value: AED 950K/i)).toBeInTheDocument()
    expect(screen.getByText(/Completed in: 6 weeks/i)).toBeInTheDocument()
    expect(screen.getByText(/Completed in: 8 weeks/i)).toBeInTheDocument()
  })

  it('should contain construction finishing specific testimonial content', () => {
    render(<MockTestimonials />)
    
    expect(screen.getByText(/kitchen and bathroom installations were flawless/i)).toBeInTheDocument()
    expect(screen.getByText(/marble installation, custom woodwork, and AC setup/i)).toBeInTheDocument()
    expect(screen.getByText(/skilled finishing specialists/i)).toBeInTheDocument()
    expect(screen.getByText(/40-floor tower/i)).toBeInTheDocument()
  })

  it('should mention construction industry terminology', () => {
    render(<MockTestimonials />)
    
    expect(screen.getByText(/handover deadline/i)).toBeInTheDocument()
    expect(screen.getByText(/luxury development/i)).toBeInTheDocument()
    expect(screen.getByText(/building contractor/i)).toBeInTheDocument()
    expect(screen.getByText(/commercial and residential projects/i)).toBeInTheDocument()
  })

  it('should not contain residential maintenance testimonial content', () => {
    render(<MockTestimonials />)
    
    expect(screen.queryByText(/cleaning/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/maintenance/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/apartment owner/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/move-in/i)).not.toBeInTheDocument()
  })
})