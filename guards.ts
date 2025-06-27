export function isAssertionError(error: unknown): error is Error & { name: 'AssertionError' } {
  return error instanceof Error && error.name === 'AssertionError'
}
