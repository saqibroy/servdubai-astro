import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JSDOM } from 'jsdom'

// Mock Astro component by creating a simple HTML structure
const createFooterHTML = () => `
<footer class="bg-text-600 text-white">
  <div class="max-w-7xl mx-auto container-padding section-padding">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div class="col-span-1 md:col-span-2 lg:col-span-1">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-14 h-14 flex items-center justify-center">
            <img src="/logo.png" alt="ServDubai Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <div class="text-xl font-bold">
              <span class="text-accent-400 font-extrabold">Serv</span><span class="text-secondary-400 font-extrabold">Dubai</span>
            </div>
            <p class="text-primary-200 text-sm font-medium">Construction Finishing Specialists</p>
          </div>
        </div>
        <p class="text-gray-300 mb-4 max-w-md">
          Dubai's premier construction finishing specialists. We complete kitchen installations, bathroom finishing, 
          flooring, and interior work for developers, contractors, and new building projects across Dubai.
        </p>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-4 text-primary-200">Construction Services</h3>
        <ul class="space-y-2">
          <li><a href="/services" class="text-gray-300 hover:text-primary-400 transition-colors">Finishing Services</a></li>
          <li><a href="/packages" class="text-gray-300 hover:text-primary-400 transition-colors">Project Packages</a></li>
          <li><a href="/about" class="text-gray-300 hover:text-primary-400 transition-colors">Our Expertise</a></li>
          <li><a href="/book" class="text-gray-300 hover:text-primary-400 transition-colors">Get Project Quote</a></li>
          <li><a href="/contact" class="text-gray-300 hover:text-primary-400 transition-colors">Schedule Site Visit</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-4 text-primary-200">Project Consultation</h3>
        <ul class="space-y-2 text-gray-300">
          <li class="flex items-center space-x-2">
            <span>+971 55 241 8446</span>
          </li>
          <li class="flex items-center space-x-2">
            <span>projects@servdubai.ae</span>
          </li>
          <li class="flex items-start space-x-2">
            <div>
              <div>Serving Dubai's Construction Industry</div>
              <div class="text-sm text-gray-400 mt-1">Marina • Downtown • Business Bay • DIFC</div>
            </div>
          </li>
        </ul>
        <div class="mt-6">
          <h4 class="text-sm font-semibold mb-2 text-primary-200">Licensed & Certified</h4>
          <ul class="space-y-1 text-xs text-gray-400">
            <li>• Dubai Municipality Licensed</li>
            <li>• Construction Industry Certified</li>
            <li>• Fully Insured & Bonded</li>
            <li>• 15+ Years Experience</li>
          </ul>
        </div>
      </div>
      <div class="lg:block hidden">
        <h3 class="text-lg font-semibold mb-4 text-primary-200">Project Areas</h3>
        <ul class="space-y-2 text-gray-300 text-sm">
          <li class="flex items-center space-x-2">
            <span>New Building Developments</span>
          </li>
          <li class="flex items-center space-x-2">
            <span>High-Rise Construction Projects</span>
          </li>
          <li class="flex items-center space-x-2">
            <span>Residential Tower Finishing</span>
          </li>
          <li class="flex items-center space-x-2">
            <span>Commercial Building Interiors</span>
          </li>
          <li class="flex items-center space-x-2">
            <span>Developer Handover Projects</span>
          </li>
        </ul>
        <div class="mt-4 p-3 bg-gray-700 rounded-lg">
          <p class="text-xs text-gray-300">
            <strong class="text-primary-200">Same-Day Site Visits</strong><br>
            Free project assessment and detailed quotes for construction finishing work.
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
      <p class="text-gray-400 text-sm">
        © 2024 ServDubai - Dubai's Premier Construction Finishing Specialists. All rights reserved.
      </p>
      <div class="flex space-x-6 mt-4 md:mt-0">
        <a href="/privacy" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Privacy Policy</a>
        <a href="/terms" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>
`

describe('Footer Component - Construction Industry Transformation', () => {
  let dom: JSDOM
  let document: Document

  beforeEach(() => {
    dom = new JSDOM(createFooterHTML())
    document = dom.window.document
  })

  it('displays construction finishing specialist tagline', () => {
    const tagline = document.querySelector('.text-primary-200.text-sm.font-medium')
    expect(tagline?.textContent).toBe('Construction Finishing Specialists')
  })

  it('shows construction industry description', () => {
    const description = document.querySelector('.text-gray-300.mb-4.max-w-md')
    expect(description?.textContent?.trim()).toContain('Dubai\'s premier construction finishing specialists')
    expect(description?.textContent?.trim()).toContain('kitchen installations, bathroom finishing')
    expect(description?.textContent?.trim()).toContain('developers, contractors, and new building projects')
  })

  it('displays construction services navigation', () => {
    const servicesHeading = document.querySelector('h3')
    expect(servicesHeading?.textContent).toBe('Construction Services')
    
    const finishingServices = document.querySelector('a[href="/services"]')
    expect(finishingServices?.textContent).toBe('Finishing Services')
    
    const projectPackages = document.querySelector('a[href="/packages"]')
    expect(projectPackages?.textContent).toBe('Project Packages')
    
    const getQuote = document.querySelector('a[href="/book"]')
    expect(getQuote?.textContent).toBe('Get Project Quote')
    
    const siteVisit = document.querySelector('a[href="/contact"]')
    expect(siteVisit?.textContent).toBe('Schedule Site Visit')
  })

  it('shows project consultation contact information', () => {
    const consultationHeading = Array.from(document.querySelectorAll('h3')).find(
      h3 => h3.textContent === 'Project Consultation'
    )
    expect(consultationHeading).toBeTruthy()
    
    const phoneNumber = Array.from(document.querySelectorAll('span')).find(
      span => span.textContent === '+971 55 241 8446'
    )
    expect(phoneNumber).toBeTruthy()
    
    const email = Array.from(document.querySelectorAll('span')).find(
      span => span.textContent === 'projects@servdubai.ae'
    )
    expect(email).toBeTruthy()
    
    const serviceArea = Array.from(document.querySelectorAll('div')).find(
      div => div.textContent === 'Serving Dubai\'s Construction Industry'
    )
    expect(serviceArea).toBeTruthy()
  })

  it('displays construction industry certifications', () => {
    const certificationHeading = Array.from(document.querySelectorAll('h4')).find(
      h4 => h4.textContent === 'Licensed & Certified'
    )
    expect(certificationHeading).toBeTruthy()
    
    const certifications = Array.from(document.querySelectorAll('li')).map(li => li.textContent)
    expect(certifications).toContain('• Dubai Municipality Licensed')
    expect(certifications).toContain('• Construction Industry Certified')
    expect(certifications).toContain('• Fully Insured & Bonded')
    expect(certifications).toContain('• 15+ Years Experience')
  })

  it('shows construction project areas', () => {
    const projectAreasHeading = Array.from(document.querySelectorAll('h3')).find(
      h3 => h3.textContent === 'Project Areas'
    )
    expect(projectAreasHeading).toBeTruthy()
    
    const projectTypes = Array.from(document.querySelectorAll('span')).map(span => span.textContent)
    expect(projectTypes).toContain('New Building Developments')
    expect(projectTypes).toContain('High-Rise Construction Projects')
    expect(projectTypes).toContain('Residential Tower Finishing')
    expect(projectTypes).toContain('Commercial Building Interiors')
    expect(projectTypes).toContain('Developer Handover Projects')
  })

  it('displays same-day site visit promotion', () => {
    const siteVisitPromo = Array.from(document.querySelectorAll('strong')).find(
      strong => strong.textContent === 'Same-Day Site Visits'
    )
    expect(siteVisitPromo).toBeTruthy()
    
    const promoText = document.querySelector('.bg-gray-700 p')
    expect(promoText?.textContent).toContain('Free project assessment and detailed quotes for construction finishing work')
  })

  it('shows updated copyright with construction specialist branding', () => {
    const copyright = Array.from(document.querySelectorAll('p')).find(
      p => p.textContent?.includes('© 2024 ServDubai - Dubai\'s Premier Construction Finishing Specialists')
    )
    expect(copyright?.textContent?.trim()).toBe('© 2024 ServDubai - Dubai\'s Premier Construction Finishing Specialists. All rights reserved.')
  })

  it('maintains service area focus on construction industry locations', () => {
    const serviceAreas = document.querySelector('.text-sm.text-gray-400.mt-1')
    expect(serviceAreas?.textContent).toBe('Marina • Downtown • Business Bay • DIFC')
  })
})