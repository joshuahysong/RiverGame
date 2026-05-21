import { createPinia, setActivePinia } from 'pinia'
import type { VueWrapper } from '@vue/test-utils'

/**
 * Creates a fresh Pinia instance for testing
 * Call this in beforeEach() to ensure isolated state
 */
export function createTestingPinia() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

/**
 * Waits for Vue to process reactive updates
 */
export async function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

/**
 * Finds an element by test ID
 */
export function findByTestId(wrapper: VueWrapper, testId: string) {
  return wrapper.find(`[data-testid="${testId}"]`)
}

/**
 * Checks if element exists by test ID
 */
export function existsByTestId(wrapper: VueWrapper, testId: string): boolean {
  return findByTestId(wrapper, testId).exists()
}
