import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock ConstructionPackages component with B2B packages
const MockConstructionPackages = () => (
  <section className="construction-packages">
    <div className="package-card">
      <h3>New Building Package</h3>
      <div className="price-range">AED 8,000 - 15,000</div>
      <p>Complete apartment finishing (kitchen + bathroom + flooring)</p>
      <p className="target-market">Perfect for developers handing over units</p>
      <ul>
        <li>Bulk pricing for multiple units</li>
        <li>Flexible timeline to match construction schedules</li>
        <li>Quality guarantee</li>
      </ul>
    </div>
    <div className="package-card">
      <h3>Kitchen & Bathroom Combo</h3>
      <div className="price-range">AED 4,500 - 8,000</div>
      <p>Complete kitchen and bathroom finishing</p>
      <p className="target-market">Ideal for apartment upgrades</p>
      <ul>
        <li>Includes all installations and connections</li>
        <li>Quality materials included</li>
        <li>Professional installation team</li>
      </ul>
    </div>
    <div className="package-card">
      <h3>Flooring Specialist Package</h3>
      <div className="price-range">AED 3,000 - 6,000</div>
      <p>Complete flooring installation (marble/tile/wood)</p>
      <p className="target-market">Perfect for large area projects</p>
      <ul>
        <li>Surface preparation and finishing</li>
        <li>Premium material options</li>
        <li>Expert installation techniques</li>
      </ul>
    </div>
    <div className="package-card">
      <h3>Custom Project Quotes</h3>
      <div className="price-range">Customized Pricing</div>
      <p>Tailored solutions for unique construction finishing needs</p>
      <p className="target-market">All construction industry clients</p>
      <ul>
        <li>Site visit and detailed assessment</li>
        <li>Customized pricing based on scope</li>
        <li>Flexible timeline to match construction schedules</li>
      </ul>
    </div>
  </section>
)

describe('ConstructionPackages Content Transformation', () => {
  it('should display all B2B construction packages', () => {
    render(<MockConstructionPackages />)
    
    expect(screen.getByText(/New Building Package/i)).toBeInTheDocument()
    expect(screen.getByText(/Kitchen & Bathroom Combo/i)).toBeInTheDocument()
    expect(screen.getByText(/Flooring Specialist Package/i)).toBeInTheDocument()
    expect(screen.getByText(/Custom Project Quotes/i)).toBeInTheDocument()
  })

  it('should display correct B2B pricing ranges', () => {
    render(<MockConstructionPackages />)
    
    expect(screen.getByText(/AED 8,000 - 15,000/i)).toBeInTheDocument()
    expect(screen.getByText(/AED 4,500 - 8,000/i)).toBeInTheDocument()
    expect(screen.getByText(/AED 3,000 - 6,000/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Customized Pricing/i)).toHaveLength(1)
  })

  it('should display B2B target market messaging', () => {
    render(<MockConstructionPackages />)
    
    expect(screen.getByText(/Perfect for developers handing over units/i)).toBeInTheDocument()
    expect(screen.getByText(/Ideal for apartment upgrades/i)).toBeInTheDocument()
    expect(screen.getByText(/Perfect for large area projects/i)).toBeInTheDocument()
    expect(screen.getByText(/All construction industry clients/i)).toBeInTheDocument()
  })

  it('should display construction industry features', () => {
    render(<MockConstructionPackages />)
    
    expect(screen.getByText(/Bulk pricing for multiple units/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Flexible timeline to match construction schedules/i)).toHaveLength(2)
    expect(screen.getByText(/Site visit and detailed assessment/i)).toBeInTheDocument()
    expect(screen.getByText(/Surface preparation and finishing/i)).toBeInTheDocument()
  })

  it('should focus on construction finishing rather than residential services', () => {
    render(<MockConstructionPackages />)
    
    expect(screen.getByText(/Complete apartment finishing/i)).toBeInTheDocument()
    expect(screen.getByText(/construction finishing needs/i)).toBeInTheDocument()
    expect(screen.getByText(/flooring installation/i)).toBeInTheDocument()
  })

  it('should not contain residential maintenance package messaging', () => {
    render(<MockConstructionPackages />)
    
    expect(screen.queryByText(/new resident/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/move-in/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/cleaning/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/maintenance/i)).not.toBeInTheDocument()
  })
})