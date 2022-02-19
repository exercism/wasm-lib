export class WasmRunner {
  constructor(wasmModule) {
    this.wasmModule = wasmModule;
    this.linearMemory = new WebAssembly.Memory({ initial: 1 });
    return WebAssembly.instantiate(this.wasmModule, {
      env: {
        linearMemory: this.linearMemory,
      },
      console: {
        log_i32_s: this.log_i32_s,
        log_i32_u: this.log_i32_u,
        log_i64_s: this.log_i64_s,
        log_i64_u: this.log_i64_u,
        log_f32: this.log_f32,
        log_f64: this.log_f64,
        log_mem_as_utf8: this.log_mem_as_utf8.bind(this),
        log_mem_as_u8: this.log_mem_as_u8.bind(this),
        log_mem_as_i8: this.log_mem_as_i8.bind(this),
        log_mem_as_i16: this.log_mem_as_i16.bind(this),
        log_mem_as_u16: this.log_mem_as_u16.bind(this),
        log_mem_as_i32: this.log_mem_as_i32.bind(this),
        log_mem_as_u32: this.log_mem_as_u32.bind(this),
        log_mem_as_i64: this.log_mem_as_i64.bind(this),
        log_mem_as_u64: this.log_mem_as_u64.bind(this),
        log_mem_as_f32: this.log_mem_as_f32.bind(this),
        log_mem_as_f64: this.log_mem_as_f64.bind(this),
      },
      math: {
        random: Math.random,
      },
    }).then((instance) => {
      this.instance = instance;
      return this;
    });
  }

  static utf8Decoder = new TextDecoder("utf8");
  static utf8Encoder = new TextEncoder();

  get exports() {
    return this.instance.exports;
  }

  /**
   * @param {number} i32Num
   */
  log_i32_s(i32Num) {
    console.log(i32Num);
  }

  /**
   * @param {number} i32Num
   */
  log_i32_u(i32Num) {
    console.log(BigInt.asUintN(32, BigInt(i32Num)).toString());
  }

  /**
   * @param {bigint} i64Num
   */
  log_i64_s(i64Num) {
    console.log(i64Num.toString());
  }

  /**
   * @param {bigint} i64Num
   */
  log_i64_u(i64Num) {
    console.log(BigInt.asUintN(64, i64Num).toString());
  }

  /**
   * @param {number} f32Num
   */
  log_f32(f32Num) {
    console.log(f32Num);
  }

  /**
   * @param {number} f64Num
   */
  log_f64(f64Num) {
    console.log(f64Num);
  }

  log_mem_validate(byteOffset, length) {
    if (!this.exports.mem) {
      console.log(
        'log_mem_* functions requires a module to export its memory with name "mem". Example: \n',
        '(memory (export "mem") 1)'
      );
    }
    /* TODO: Validate offset is within bounds */
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type f64
   * @returns {string}
   */
  get_mem_as_utf8(byteOffset, length) {
    this.log_mem_validate(byteOffset, length);
    const segment = new Uint8Array(this.exports.mem.buffer, byteOffset, length);
    return WasmRunner.utf8Decoder.decode(segment);
  }

  /**
   * @param {number} byteOffset
   * @param {number} length length of UTF-8 encoded string in bytes
   */
  log_mem_as_utf8(byteOffset, length) {
    console.log(this.get_mem_as_utf8(byteOffset, length));
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type f64
   * @returns {Int8Array}
   */
  get_mem_as_i8(byteOffset, length) {
    this.log_mem_validate(byteOffset, length);
    return new Int8Array(this.exports.mem.buffer, byteOffset, length);
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type i8
   */
  log_mem_as_i8(byteOffset, length) {
    console.log(this.get_mem_as_i8(byteOffset, length));
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type f64
   * @returns {Uint8Array}
   */
  get_mem_as_u8(byteOffset, length) {
    this.log_mem_validate(byteOffset, length);
    return new Uint8Array(this.exports.mem.buffer, byteOffset, length);
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type u8
   */
  log_mem_as_u8(byteOffset, length) {
    console.log(this.get_mem_as_u8(byteOffset, length));
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type f64
   * @returns {Int16Array}
   */
  get_mem_as_i16(byteOffset, length) {
    this.log_mem_validate(byteOffset, length);
    return new Int16Array(this.exports.mem.buffer, byteOffset, length);
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type i16
   */
  log_mem_as_i16(byteOffset, length) {
    console.log(this.get_mem_as_i16(byteOffset, length));
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type f64
   * @returns {Uint16Array}
   */
  get_mem_as_u16(byteOffset, length) {
    this.log_mem_validate(byteOffset, length);
    return new Uint16Array(this.exports.mem.buffer, byteOffset, length);
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type u16
   */
  log_mem_as_u16(byteOffset, length) {
    console.log(this.get_mem_as_u16(byteOffset, length));
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type f64
   * @returns {Int32Array}
   */
  get_mem_as_i32(byteOffset, length) {
    this.log_mem_validate(byteOffset, length);
    return new Int32Array(this.exports.mem.buffer, byteOffset, length);
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type i32
   */
  log_mem_as_i32(byteOffset, length) {
    console.log(this.get_mem_as_i32(byteOffset, length));
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type f64
   * @returns {Uint32Array}
   */
  get_mem_as_u32(byteOffset, length) {
    this.log_mem_validate(byteOffset, length);
    return new Uint32Array(this.exports.mem.buffer, byteOffset, length);
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type u32
   */
  log_mem_as_u32(byteOffset, length) {
    console.log(this.get_mem_as_u32(byteOffset, length));
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type f64
   * @returns {BigInt64Array}
   */
  get_mem_as_i64(byteOffset, length) {
    this.log_mem_validate(byteOffset, length);
    return new BigInt64Array(this.exports.mem.buffer, byteOffset, length);
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type i64
   */
  log_mem_as_i64(byteOffset, length) {
    console.log(this.get_mem_as_i64(byteOffset, length));
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type f64
   * @returns {BigUint64Array}
   */
  get_mem_as_u64(byteOffset, length) {
    this.log_mem_validate(byteOffset, length);
    return new BigUint64Array(this.exports.mem.buffer, byteOffset, length);
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type u64
   */
  log_mem_as_u64(byteOffset, length) {
    console.log(this.get_mem_as_u64(byteOffset, length));
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type f64
   * @returns {Float32Array}
   */
  get_mem_as_f32(byteOffset, length) {
    this.log_mem_validate(byteOffset, length);
    return new Float32Array(this.exports.mem.buffer, byteOffset, length);
  }

  /**
   * @param {number} byteOffset From wasm u32
   * @param {number} length number of elements of type f32
   */
  log_mem_as_f32(byteOffset, length) {
    console.log(this.get_mem_as_f32(byteOffset, length));
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type f64
   * @returns {Float64Array}
   */
  get_mem_as_f64(byteOffset, length) {
    this.log_mem_validate(byteOffset, length);
    return new Float64Array(this.exports.mem.buffer, byteOffset, length);
  }

  /**
   * @param {number} byteOffset
   * @param {number} length number of elements of type f64
   */
  log_mem_as_f64(byteOffset, length) {
    console.log(this.get_mem_as_f64(byteOffset, length));
  }
}
