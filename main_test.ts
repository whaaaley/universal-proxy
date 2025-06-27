import { assertEquals, assertNotEquals } from 'jsr:@std/assert'
import { describe, it } from 'jsr:@std/testing/bdd'
import { isAssertionError } from './guards.ts'
import anything from './main.ts'

describe('anything() universal proxy', () => {
  describe('basic operations', () => {
    it('should allow destructuring', () => {
      const { api, config, db } = anything()
      assertEquals(typeof api, 'function')
      assertEquals(typeof config, 'function')
      assertEquals(typeof db, 'function')
    })

    it('should support property chaining', () => {
      const { api } = anything()
      const result = api.users.fetch.data.process
      assertEquals(typeof result, 'function')
    })

    it('should support function calls', () => {
      const { api } = anything()
      const result = api.getUsers()
      assertEquals(typeof result, 'function')
    })

    it('should support constructors', () => {
      const { Validator } = anything()
      const instance = new Validator()
      assertEquals(typeof instance, 'function')
    })

    it('should support array destructuring', () => {
      const { hook } = anything()
      const [first, second, third] = hook()
      assertEquals(typeof first, 'function')
      assertEquals(typeof second, 'function')
      assertEquals(typeof third, 'function')
    })
  })

  describe('primitive conversion', () => {
    it('should handle length checks', () => {
      const { result } = anything()
      assertEquals(result.length, 0)
      assertEquals(result.length > 0, false)
    })

    it('should handle string concatenation', () => {
      const { name } = anything()
      const greeting = 'Hello ' + name
      assertEquals(greeting, 'Hello true')
    })

    it('should handle math operations', () => {
      const { count } = anything()
      const total = count + 10
      assertEquals(total, 11) // 0 + 10 + 1 (true coerced)
    })

    it('should handle comparisons', () => {
      const { value } = anything()
      assertEquals(value > 0, false)
      assertEquals(value < 10, true)
      assertEquals(value >= 0, true)
    })

    it('should handle toString() calls', () => {
      const { data } = anything()
      assertEquals(data.toString(), '')
    })

    it('should handle valueOf() calls', () => {
      const { data } = anything()
      assertEquals(data.valueOf(), 0)
    })
  })

  describe('iterator behavior', () => {
    it('should support Symbol.iterator', () => {
      const { iterable } = anything()
      assertEquals(typeof iterable[Symbol.iterator], 'function')
    })

    it('should work with for...of loops', () => {
      const { collection } = anything()
      let count = 0

      for (const item of collection()) {
        assertEquals(typeof item, 'function')
        count++
        if (count >= 3) break // Prevent infinite loop
      }

      assertEquals(count, 3)
    })
  })

  describe('multiple instances', () => {
    it('should create independent proxies', () => {
      const { api: api1 } = anything()
      const { api: api2 } = anything()
      assertNotEquals(api1, api2)
    })

    it('should not interfere with each other', () => {
      const proxy1 = anything()
      const proxy2 = anything()

      const result1 = proxy1.test.method()
      const result2 = proxy2.different.call()

      assertEquals(typeof result1, 'function')
      assertEquals(typeof result2, 'function')
    })
  })

  describe('edge cases', () => {
    it('should handle array-like access', () => {
      const { arrayLike } = anything()
      assertEquals(typeof arrayLike[0], 'function')
      assertEquals(typeof arrayLike[999], 'function')
      assertEquals(arrayLike.length, 0)
    })

    it('should handle JSON serialization', () => {
      const { data } = anything()
      const serialized = JSON.stringify(data)
      assertEquals(serialized, undefined)
    })

    it('should handle property existence checks', () => {
      const { obj } = anything()
      assertEquals('someProperty' in obj, true)
      assertEquals('anyProperty' in obj, true)
    })

    it('should handle deep nesting', () => {
      const { deep } = anything()
      const veryDeep = deep.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p
      assertEquals(typeof veryDeep, 'function')
      assertEquals(typeof veryDeep(), 'function')
    })

    it('should handle delete operations', () => {
      const { obj } = anything()
      assertEquals(delete obj.someProperty, true)
      assertEquals(delete obj.anotherProperty, true)
    })
  })

  describe('real-world scenarios', () => {
    it('should prevent runtime crashes', () => {
      const { config, formatter } = anything()

      function processData(input: string) {
        const settings = config.getSettings()
        const validator = new settings.Validator()

        if (input.length === 10) {
          return formatter.format(input, validator.options)
        }

        return input
      }

      const result = processData('1234567890')
      assertEquals(typeof result, 'function')
    })

    it('should allow clean assertion failures', () => {
      const { service } = anything()
      const result = service.process('test-data')

      try {
        assertEquals(result, 'expected-output')
      } catch (error) {
        if (isAssertionError(error)) {
          assertEquals(error.name, 'AssertionError')
        }
      }
    })
  })
})
