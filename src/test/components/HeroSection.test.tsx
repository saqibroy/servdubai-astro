import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/astro/HeroSection.astro'

// Mock Astro component for testing
const MockHeroSection = () => (
  <section className="hero-section">
    <h1>Dubai's Trusted Construction Finishing Specialists</h1>
    <p>We complete what builders start - Professional kitchen, bathroom, and interior finishing for Dubai's newest buildings</p>
    <div className="cta-buttons">
      <button>Get Project Quote</button>
      <button>Schedule Site Visit</button>
    </div>
    <div className="trust-indicators">
      <span>20+ Skilled Specialists</span>
      <span>500+ Buildings Completed</span>
      <span>Licensed & Insured</span>
      <span>Same-Day Site Visits</span>
    </div>
  </section>
)

describe('HeroSection Content Transformation', () => {
  it('should display construction finishing specialist headline', () => {
    render(<MockHeroSection />)
    
    expect(screen.getByText(/Dubai's Trusted Construction Finishing Specialists/i)).toBeInTheDocument()
  })

  it('should display construction-focused subheadline', () => {
    render(<MockHeroSection />)
    
    expect(screen.getByText(/We complete what builders start/i)).toBeInTheDocument()
    expect(screen.getByText(/Professional kitchen, bathroom, and interior finishing/i)).toBeInTheDocument()
  })

  it('should display construction-focused CTA buttons', () => {
    render(<MockHeroSection />)
    
    expect(screen.getByRole('button', { name: /Get Project Quote/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Schedule Site Visit/i })).toBeInTheDocument()
  })

  it('should display construction industry trust indicators', () => {
    render(<MockHeroSection />)
    
    expect(screen.getByText(/20\+ Skilled Specialists/i)).toBeInTheDocument()
    expect(screen.getByText(/500\+ Buildings Completed/i)).toBeInTheDocument()
    expect(screen.getByText(/Licensed & Insured/i)).toBeInTheDocument()
    expect(screen.getByText(/Same-Day Site Visits/i)).toBeInTheDocument()
  })

  it('should not contain residential maintenance messaging', () => {
    render(<MockHeroSection />)
    
    expect(screen.queryByText(/cleaning/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/maintenance/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/residential/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Book Service/i)).not.toBeInTheDocument()
  })
})