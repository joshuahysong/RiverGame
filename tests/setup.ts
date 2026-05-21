import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock BootstrapVue components and directives
config.global.stubs = {
  'b-button': true,
  'b-icon': true,
  'b-modal': true,
  'b-navbar': true,
  'b-navbar-brand': true,
  'b-navbar-nav': true,
  'b-nav-form': true,
  'b-form-checkbox': true,
  'b-card': true,
  'b-card-text': true,
  'b-progress': true,
  'b-progress-bar': true,
  'b-badge': true,
}

// Mock BootstrapVue $bvModal
config.global.mocks = {
  $bvModal: {
    show: vi.fn(),
    hide: vi.fn(),
    msgBoxConfirm: vi.fn().mockResolvedValue(true),
  },
}
