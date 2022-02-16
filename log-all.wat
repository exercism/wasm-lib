(module
  (import "console" "log_i32_s" (func $log_i32_s (param i32)))
  (import "console" "log_i32_u" (func $log_i32_u (param i32)))
  (import "console" "log_i64_s" (func $log_i64_s (param i64)))
  (import "console" "log_i64_u" (func $log_i64_u (param i64)))
  (import "console" "log_f32" (func $log_f32 (param f32)))
  (import "console" "log_f64" (func $log_f64 (param f64)))
  (import "console" "log_mem_as_utf8" (func $log_mem_as_utf8 (param $byteOffset i32) (param $length i32)))
  (import "console" "log_mem_as_i8" (func $log_mem_as_i8 (param $byteOffset i32) (param $length i32)))
  (import "console" "log_mem_as_u8" (func $log_mem_as_u8 (param $byteOffset i32) (param $length i32)))
  (import "console" "log_mem_as_i16" (func $log_mem_as_i16 (param $byteOffset i32) (param $length i32)))
  (import "console" "log_mem_as_u16" (func $log_mem_as_u16 (param $byteOffset i32) (param $length i32)))
  (import "console" "log_mem_as_i32" (func $log_mem_as_i32 (param $byteOffset i32) (param $length i32)))
  (import "console" "log_mem_as_u32" (func $log_mem_as_u32 (param $byteOffset i32) (param $length i32)))
  (import "console" "log_mem_as_i64" (func $log_mem_as_i64 (param $byteOffset i32) (param $length i32)))
  (import "console" "log_mem_as_u64" (func $log_mem_as_u64 (param $byteOffset i32) (param $length i32)))
  (import "console" "log_mem_as_f32" (func $log_mem_as_f32 (param $byteOffset i32) (param $length i32)))
  (import "console" "log_mem_as_f64" (func $log_mem_as_f64 (param $byteOffset i32) (param $length i32)))
  (import "math" "random" (func $random (result f64)))

  (memory (export "mem") 1)
  (data (i32.const 64) "Goodbye, Mars!")

  (func (export "logAll") (result i32)
    ;; Log Immediates
    (call $log_i32_s (i32.const 99))
    (call $log_i32_u (i32.const -1))
    (call $log_i64_s (i64.const 99))
    (call $log_i64_u (i64.const -1))
    (call $log_f32 (f32.const 3.14))
    (call $log_f64 (f64.const 3.14))

    ;; Log String 
    (call $log_mem_as_utf8 (i32.const 64) (i32.const 14))

    ;; Log static arrays of values from linear memory
    (memory.fill (i32.const 128) (i32.const 42) (i32.const 10))
    (call $log_mem_as_u8 (i32.const 128) (i32.const 10))
    (memory.fill (i32.const 128) (i32.const -42) (i32.const 10))
    (call $log_mem_as_i8 (i32.const 128) (i32.const 10))

    (i32.store16 (i32.const 128) (i32.const 10000))
    (i32.store16 (i32.const 130) (i32.const 10001))
    (i32.store16 (i32.const 132) (i32.const 10002))
    (call $log_mem_as_u16 (i32.const 128) (i32.const 3))

    (i32.store16 (i32.const 128) (i32.const -10000))
    (i32.store16 (i32.const 130) (i32.const -10001))
    (i32.store16 (i32.const 132) (i32.const -10002))
    (call $log_mem_as_i16 (i32.const 128) (i32.const 3))

    (i32.store (i32.const 128) (i32.const 100000000))
    (i32.store (i32.const 132) (i32.const 100000001))
    (i32.store (i32.const 136) (i32.const 100000002))
    (call $log_mem_as_u32 (i32.const 128) (i32.const 3))

    (i32.store (i32.const 128) (i32.const -10000000))
    (i32.store (i32.const 132) (i32.const -10000001))
    (i32.store (i32.const 136) (i32.const -10000002))
    (call $log_mem_as_i32 (i32.const 128) (i32.const 3))

    (i64.store (i32.const 128) (i64.const 10000000000))
    (i64.store (i32.const 136) (i64.const 10000000001))
    (i64.store (i32.const 144) (i64.const 10000000002))
    (call $log_mem_as_u64 (i32.const 128) (i32.const 3))

    (i64.store (i32.const 128) (i64.const -10000000000))
    (i64.store (i32.const 136) (i64.const -10000000001))
    (i64.store (i32.const 144) (i64.const -10000000002))
    (call $log_mem_as_i64 (i32.const 128) (i32.const 3))
    
    (f32.store (i32.const 128) (f32.const 3.14))
    (f32.store (i32.const 132) (f32.const 3.14))
    (f32.store (i32.const 136) (f32.const 3.14))
    (call $log_mem_as_f32 (i32.const 128) (i32.const 3))

    (f64.store (i32.const 128) (f64.const 3.14))
    (f64.store (i32.const 136) (f64.const 3.14))
    (f64.store (i32.const 144) (f64.const 3.14))
    (call $log_mem_as_f64 (i32.const 128) (i32.const 3))

    ;; Log random double
    (call $log_f64 (call $random))

    (i32.const 0)
  )

)
