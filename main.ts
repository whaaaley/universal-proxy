function anything(): any {
  function UniversalProxy(): any {
    return anything()
  }

  return new Proxy(UniversalProxy, {
    get(_target, prop) {
      // Handle primitive conversion methods
      if (prop === Symbol.toPrimitive) {
        return (hint: string) => {
          if (hint === 'number') return 0
          if (hint === 'string') return ''
          return true // default hint
        }
      }

      if (prop === 'valueOf') {
        return () => 0
      }

      if (prop === 'toString') {
        return () => ''
      }

      if (prop === 'length') {
        return 0 // Common property that gets checked
      }

      // Handle array destructuring
      if (prop === Symbol.iterator) {
        return function* () {
          // Yield infinite proxies for array destructuring
          while (true) {
            yield anything()
          }
        }
      }

      // Handle numeric indices for array-like access
      if (typeof prop === 'number' || (typeof prop === 'string' && /^\d+$/.test(prop))) {
        return anything()
      }

      // Everything else returns another proxy
      return anything()
    },
    apply() {
      return anything()
    },
    construct() {
      return anything()
    },
    has() {
      return true
    },
  })
}

export default anything
