# Universal Proxy

**A proxy that handles any property access, function call, or constructor.**

## What it does

Returns a proxy that responds to any operation:

- Property access: `obj.any.nested.property`
- Function calls: `obj.anyMethod()`
- Constructors: `new obj.AnyClass()`
- Array destructuring: `const [a, b] = obj()`
- Primitive operations: `obj + 10`, `obj > 0`, `String(obj)`

## Installation

```bash
deno add jsr:@cynthia/universal-proxy
```

## Usage

```javascript
import anything from 'jsr:@cynthia/universal-proxy'

const { api, config, service } = anything()

// All operations work without errors
const user = api.users.fetch()
const settings = config.app.theme
const instance = new service.Validator()
const [state] = api.useState()
```

## Known Limitations

**Infinite iterators**: The proxy uses infinite generators for array destructuring. This means:

```javascript
const { hook } = anything()

// ✅ Works - manual break
for (const item of hook()) {
  if (count++ > 2) break
}

// ✅ Works - limited destructuring
const [a, b, c] = hook()

// ❌ Hangs - tries to consume infinite iterator
const items = [...hook()]
const all = Array.from(hook())
```

Use manual breaks or limited destructuring when working with iterators.
