/**
 * Mock API is enabled by default until a real backend is connected.
 * Set NEXT_PUBLIC_USE_MOCK_API=false to use HTTP repositories.
 */
export const isMockApiEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false'
}
