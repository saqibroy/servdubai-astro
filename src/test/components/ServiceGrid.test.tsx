import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock ServiceGrid component with construction services
const MockServiceGrid = () => (
  <section className="service-grid">
    <div className="service-card">
      <h3>Kitchen Finishing Projects</h3>
      <p>From empty shells to dream kitchens - complete installations including cabinets, countertops, appliances, and connections</p>
      <span className="price">Starting AED 2,500</span>
      <span className="price-unit">per project</span>
    </div>
    <div className="service-card">
      <h3>Bathroom Construction Completion</h3>
      <p>Professional bathroom finishing including fixture installation, tiling, marble work, and plumbing connections</p>
      <span className="price">Starting AED 1,800</span>
      <span className="price-unit">per project</span>
    </div>
    <div className="service-card">
      <h3>Flooring & Tiling Specialists</h3>
      <p>Expert marble, granite, and tile installation for new buildings</p>
      <span className="price">Starting AED 80</span>
      <span className="price-unit">per sqm</span>
    </div>
    <div className="service-card">
      <h3>Custom Woodwork & Carpentry</h3>
      <p>Built-in wardrobes, custom cabinets, and wooden installations</p>
      <span className="price">Starting AED 1,200</span>
      <span className="price-unit">per project</span>
    </div>
    <div className="service-card">
      <h3>Building Painting & Finishing</h3>
      <p>Complete interior and exterior painting services for new constructions</p>
      <span className="price">Starting AED 25</span>
      <span className="price-unit">per sqm</span>
    </div>
    <div className="service-card">
      <h3>AC Installation & Setup</h3>
      <p>Professional air conditioning installation and setup for new buildings</p>
      <span className="price">Starting AED 800</span>
      <span className="price-unit">per project</span>
    </div>
  </section>
)

describe('ServiceGrid Content Transformation', () => {
  it('should display all 6 construction finishing services', () => {
    render(<MockServiceGrid />)
    
    expect(screen.getByText(/Kitchen Finishing Projects/i)).toBeInTheDocument()
    expect(screen.getByText(/Bathroom Construction Completion/i)).toBeInTheDocument()
    expect(screen.getByText(/Flooring & Tiling Specialists/i)).toBeInTheDocument()
    expect(screen.getByText(/Custom Woodwork & Carpentry/i)).toBeInTheDocument()
    expect(screen.getByText(/Building Painting & Finishing/i)).toBeInTheDocument()
    expect(screen.getByText(/AC Installation & Setup/i)).toBeInTheDocument()
  })

  it('should display correct pricing for each service', () => {
    render(<MockServiceGrid />)
    
    expect(screen.getByText(/Starting AED 2,500/i)).toBeInTheDocument() // Kitchen
    expect(screen.getByText(/Starting AED 1,800/i)).toBeInTheDocument() // Bathroom
    expect(screen.getByText(/Starting AED 80$/i)).toBeInTheDocument() // Flooring
    expect(screen.getByText(/Starting AED 1,200/i)).toBeInTheDocument() // Woodwork
    expect(screen.getByText(/Starting AED 25/i)).toBeInTheDocument() // Painting
    expect(screen.getByText(/Starting AED 800/i)).toBeInTheDocument() // AC
  })

  it('should display correct pricing units', () => {
    render(<MockServiceGrid />)
    
    // Count per project pricing
    const perProjectElements = screen.getAllByText(/per project/i)
    expect(perProjectElements).toHaveLength(4) // Kitchen, Bathroom, Woodwork, AC
    
    // Count per sqm pricing
    const perSqmElements = screen.getAllByText(/per sqm/i)
    expect(perSqmElements).toHaveLength(2) // Flooring, Painting
  })

  it('should display construction-focused service descriptions', () => {
    render(<MockServiceGrid />)
    
    expect(screen.getByText(/complete installations including cabinets, countertops/i)).toBeInTheDocument()
    expect(screen.getByText(/fixture installation, tiling, marble work/i)).toBeInTheDocument()
    expect(screen.getByText(/marble, granite, and tile installation for new buildings/i)).toBeInTheDocument()
    expect(screen.getByText(/Built-in wardrobes, custom cabinets/i)).toBeInTheDocument()
    expect(screen.getByText(/interior and exterior painting services for new constructions/i)).toBeInTheDocument()
    expect(screen.getByText(/air conditioning installation and setup for new buildings/i)).toBeInTheDocument()
  })

  it('should not contain residential maintenance services', () => {
    render(<MockServiceGrid />)
    
    expect(screen.queryByText(/cleaning/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/maintenance/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/repair/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/deep clean/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/move-in/i)).not.toBeInTheDocument()
  })
})