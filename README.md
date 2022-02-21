# wasm-lib

_A standard library of functions for the Exercism WebAssembly track_

## Justification

WebAssembly code can only access external state or functions explicitly provided as imports. Similarly, code in the external host environment can only access state and functions defined within WebAssembly that are explicitly exported.

The rules around exporting and importing state and functions define a sandboxed security environment. This is similar to native module systems, such as ECMAScript modules, with the key exception that no external host state or functionality is visible to WebAssembly via global state, such as the `window` object in JavaScript.

This strict security model makes debugging WebAssembly a bit more difficult, as there is no `console.log` out of the box.

In order to provide `console.log` like functionality and a few other niceties, the Exercism WebAssembly track exposes a standard library of functions across all exercises.

These must be imported at the top of your WebAssembly module and then can be called from within WebAssembly functions.

## Console

The console namespace provide logging functions for logging the primitive WebAssembly types from locals, globals, and linear memory.

The linear memory functions behave similarly to JavaScript TypedArrays and interpret a range of addresses within linear memory as static arrays of certain types. This means that the length parameters are not measured in bytes, but the number of consecutive elements of the type associated with the function.

**In order for these functions to work, your WebAssembly module must declare and export its linear memory using the named export "mem"**

```wasm
(memory (export "mem") 1)
```

### log_i32_s - Log a 32-bit signed integer to console

```wasm
(module
  (import "console" "log_i32_s" (func $log_i32_s (param i32)))
  (func $main
    ;; logs -1
    (call $log_i32_s (i32.const -1))
  )
)
```

### log_i32_u - Log a 32-bit unsigned integer to console

```wasm
(module
  (import "console" "log_i32_u" (func $log_i32_u (param i32)))
  (func $main
    ;; Logs 42 to console
    (call $log_i32_u (i32.const 42))
  )
)
```

### log_i64_s - Log a 64-bit signed integer to console

```wasm
(module
  (import "console" "log_i64_s" (func $log_i64_s (param i64)))
  (func $main
    ;; Logs -99 to console
    (call $log_i32_u (i64.const -99))
  )
)
```

### log_i64_u - Log a 64-bit unsigned integer to console

```wasm
(module
  (import "console" "log_i64_u" (func $log_i64_u (param i64)))
  (func $main
    ;; Logs 42 to console
    (call $log_i64_u (i32.const 42))
  )
)
```

### log_f32 - Log a 32-bit floating point number to console

```wasm
(module
  (import "console" "log_f32" (func $log_f32 (param f32)))
  (func $main
    ;; Logs 3.140000104904175 to console
    (call $log_f32 (f32.const 3.14))
  )
)
```

### log_f64 - Log a 64-bit floating point number to console

```wasm
(module
  (import "console" "log_f64" (func $log_f64 (param f64)))
  (func $main
    ;; Logs 3.14 to console
    (call $log_f64 (f64.const 3.14))
  )
)
```

### log_mem_as_utf8 - Log a sequence of UTF8 characters to console

```wasm
(module
  (import "console" "log_mem_as_utf8" (func $log_mem_as_utf8 (param $byteOffset i32) (param $length i32)))
  (memory (export "mem") 1)
  (data (i32.const 64) "Goodbye, Mars!")
  (func $main
    ;; Logs "Goodbye, Mars!" to console
    (call $log_mem_as_utf8 (i32.const 64) (i32.const 14)
  )
)
```

### log_mem_as_i8 - Log a sequence of signed 8-bit integers to console

```wasm
(module
  (import "console" "log_mem_as_i8" (func $log_mem_as_i8 (param $byteOffset i32) (param $length i32)))
  (memory (export "mem") 1)
  (func $main
    (memory.fill (i32.const 128) (i32.const -42) (i32.const 10))
    ;; Logs an array of 10x -42 to console
    (call $log_mem_as_u8 (i32.const 128) (i32.const 10))
  )
)
```

### log_mem_as_u8 - Log a sequence of unsigned 8-bit integers to console

```wasm
(module
  (import "console" "log_mem_as_u8" (func $log_mem_as_u8 (param $byteOffset i32) (param $length i32)))
  (memory (export "mem") 1)
  (func $main
    (memory.fill (i32.const 128) (i32.const 42) (i32.const 10))
    ;; Logs an array of 10x 42 to console
    (call $log_mem_as_u8 (i32.const 128) (i32.const 10))
  )
)
```

### log_mem_as_i16 - Log a sequence of signed 16-bit integers to console

```wasm
(module
  (import "console" "log_mem_as_i16" (func $log_mem_as_i16 (param $byteOffset i32) (param $length i32)))
  (memory (export "mem") 1)
  (func $main
    (i32.store16 (i32.const 128) (i32.const -10000))
    (i32.store16 (i32.const 130) (i32.const -10001))
    (i32.store16 (i32.const 132) (i32.const -10002))
    ;; Logs [-10000, -10001, -10002] to console
    (call $log_mem_as_i16 (i32.const 128) (i32.const 3))
  )
)
```

### log_mem_as_u16 - Log a sequence of unsigned 16-bit integers to console

```wasm
(module
  (import "console" "log_mem_as_u16" (func $log_mem_as_u16 (param $byteOffset i32) (param $length i32)))
  (memory (export "mem") 1)
  (func $main
    (i32.store16 (i32.const 128) (i32.const 10000))
    (i32.store16 (i32.const 130) (i32.const 10001))
    (i32.store16 (i32.const 132) (i32.const 10002))
    ;; Logs [10000, 10001, 10002] to console
    (call $log_mem_as_u16 (i32.const 128) (i32.const 3))
  )
)
```

### log_mem_as_i32 - Log a sequence of signed 32-bit integers to console

```wasm
(module
  (import "console" "log_mem_as_i32" (func $log_mem_as_i32 (param $byteOffset i32) (param $length i32)))
  (memory (export "mem") 1)
  (func $main
    (i32.store (i32.const 128) (i32.const -10000000))
    (i32.store (i32.const 132) (i32.const -10000001))
    (i32.store (i32.const 136) (i32.const -10000002))
    ;; Logs [-10000000, -10000001, -10000002] to console
    (call $log_mem_as_i32 (i32.const 128) (i32.const 3))
  )
)
```

### log_mem_as_u32 - Log a sequence of unsigned 32-bit integers to console

```wasm
(module
  (import "console" "log_mem_as_u32" (func $log_mem_as_u32 (param $byteOffset i32) (param $length i32)))
  (memory (export "mem") 1)
  (func $main
    (i32.store (i32.const 128) (i32.const 100000000))
    (i32.store (i32.const 132) (i32.const 100000001))
    (i32.store (i32.const 136) (i32.const 100000002))
    ;; Logs [100000000, 100000001, 100000002] to console
    (call $log_mem_as_u32 (i32.const 128) (i32.const 3))
  )
)
```

### log_mem_as_i64 - Log a sequence of signed 64-bit integers to console

```wasm
(module
  (import "console" "log_mem_as_i64" (func $log_mem_as_i64 (param $byteOffset i32) (param $length i32)))
  (memory (export "mem") 1)
  (func $main
    (i64.store (i32.const 128) (i64.const -10000000000))
    (i64.store (i32.const 136) (i64.const -10000000001))
    (i64.store (i32.const 144) (i64.const -10000000002))
    ;; Logs [-10000000000, -10000000001, -10000000002] to console
    (call $log_mem_as_i64 (i32.const 128) (i32.const 3))
  )
)
```

### log_mem_as_u64 - Log a sequence of unsigned 64-bit integers to console

```wasm
(module
  (import "console" "log_mem_as_u64" (func $log_mem_as_u64 (param $byteOffset i32) (param $length i32)))
  (memory (export "mem") 1)
  (func $main
    (i64.store (i32.const 128) (i64.const 10000000000))
    (i64.store (i32.const 136) (i64.const 10000000001))
    (i64.store (i32.const 144) (i64.const 10000000002))
    ;; Logs [10000000000, 10000000001, 10000000002] to console
    (call $log_mem_as_u64 (i32.const 128) (i32.const 3))
  )
)
```

### log_mem_as_u64 - Log a sequence of 32-bit floating point numbers to console

```wasm
(module
  (import "console" "log_mem_as_f32" (func $log_mem_as_f32 (param $byteOffset i32) (param $length i32)))
  (memory (export "mem") 1)
  (func $main
    (f32.store (i32.const 128) (f32.const 3.14))
    (f32.store (i32.const 132) (f32.const 3.14))
    (f32.store (i32.const 136) (f32.const 3.14))
    ;; Logs [3.140000104904175, 3.140000104904175, 3.140000104904175] to console
    (call $log_mem_as_u64 (i32.const 128) (i32.const 3))
  )
)
```

### log_mem_as_f64 - Log a sequence of 64-bit floating point numbers to console

```wasm
(module
  (import "console" "log_mem_as_f64" (func $log_mem_as_f64 (param $byteOffset i32) (param $length i32)))
  (memory (export "mem") 1)
    (f64.store (i32.const 128) (f64.const 3.14))
    (f64.store (i32.const 136) (f64.const 3.14))
    (f64.store (i32.const 144) (f64.const 3.14))
    ;; Logs [3.14, 3.14, 3.14] to console
    (call $log_mem_as_u64 (i32.const 128) (i32.const 3))
  )
)
```

## Math

These are other library functions provided by the WebAssembly Track standard library. This is intentionally kept small and only provided when a capability can not be written from WebAssembly structions

### random - Get a random 64-bit bit floating point number between 0 and 1

Justification: there is no true source of entropy in the WebAssembly abstract machine. A host import is needed to provide randomness.

```wasm
(import "math" "random" (func $random (result f64)))
```

# JavaScript API

## WAT Tooling

### compileWat(watPath, optionsOverrides)

This function parses a `*.wat` file at the absolute path `watPath` and translates it into a `*.wasm` binary in the same directory.

By default, several extensions are enabled:

```js
let defaultWabtOptions = {
  exceptions: true,
  mutable_globals: true,
  set_float_to_int: true,
  sign_extension: true,
  simd: true,
  threads: false,
  multi_value: true,
  bulk_memory: true,
  reference_types: true,
  annotations: true,
  gc: false,
};
```

See the [wabt.js documentation](https://www.npmjs.com/package/wabt) for details on this API. Detailed information on each proposal is available in the [WebAssembly specification repo](https://github.com/WebAssembly/proposals). Some of the proposals have been merged into the core specification and can be found under "Finished Proposals."

Using this API looks something like the following

```js
import { compileWat, WasmRunner } from "wasm-lib";
try {
  const watPath = new URL("./two-fer.wat", import.meta.url);
  const { buffer } = await compileWat(watPath);
  const wasmModule = await WebAssembly.compile(buffer);
} catch (err) {
  console.log(`Error compiling *.wat: ${err}`);
}
```

## WasmRunner

WasmRunner is JavaScript class that encapsulates the process of instantiating a WebAssembly module with the track's standard library of imports.

After executing the `compileWat` example, instantiating `wasmModule` would look as follows:

```js
let currentInstance = await new WasmRunner(wasmModule);
```

Via a getter, exports are delegated to the wrapped WebAssembly instance, so the exports API works identically as working directly with a WebAssembly instance JS object.

```js
let a = 1;
let b = 2;
let c = currentInstance.exports.add(a, b);
expect(c).toEqual(a + b);
```

In order to simplify unit tests, some convenience methods are available on an instance of `WasmRunner` for interacting with the WebAssembly linear memory.

Most of these functions provide bounds checking and return TypedArrays. However, a UTF8 setter `set_mem_as_utf8` is provided because it also handles encoding. Setting static arrays of other vectors is best accomplished via direct use of the TypedArray returned by the getter.

### get_mem_as_utf8(byteOffset, length)

Decodes a sequence of UTF8 characters starting at byteOffset, returning a JavaScript string.

### set_mem_as_utf8(byteOffset, length, inputString)

Given JavaScript string inputString, encodes a sequence of UTF8 characters starting at byteOffset.

### get_mem_as_i8(byteOffset, length)

Returns a Int8Array starting at byteOffset

### get_mem_as_u8(byteOffset, length)

Returns a Uint8Array starting at byteOffset

### get_mem_as_i16(byteOffset, length)

Returns a Int16Array starting at byteOffset

### get_mem_as_u16(byteOffset, length)

Returns a Uint16Array starting at byteOffset

### get_mem_as_i32(byteOffset, length)

Returns a Int32Array starting at byteOffset

### get_mem_as_u32(byteOffset, length)

Returns a Uint32Array starting at byteOffset

### get_mem_as_i64(byteOffset, length)

Returns a Int64Array starting at byteOffset

### get_mem_as_u64(byteOffset, length)

Returns a Uint64Array starting at byteOffset

### get_mem_as_f32(byteOffset, length)

Returns a Float32Array starting at byteOffset

### get_mem_as_f32(byteOffset, length)

Returns a Float64Array starting at byteOffset
