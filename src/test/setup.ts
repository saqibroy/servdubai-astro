import '@testing-library/jest-dom'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock File and FileList for file upload tests
global.File = class MockFile {
  constructor(
    public bits: BlobPart[],
    public name: string,
    public options?: FilePropertyBag
  ) {}
  
  get size() {
    return this.bits.reduce((size, bit) => {
      if (typeof bit === 'string') return size + bit.length
      if (bit instanceof ArrayBuffer) return size + bit.byteLength
      return size + (bit as any).length || 0
    }, 0)
  }
  
  get type() {
    return this.options?.type || ''
  }
}

global.FileList = class MockFileList extends Array {
  item(index: number) {
    return this[index] || null
  }
}