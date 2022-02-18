// @ts-check

import { jest } from "@jest/globals";
import { compileWat } from "./compile-wat.mjs";
import { WasmRunner } from "./wasmRunner.mjs";

let wasmModule;
let currentInstance;
let mock_log_i32_s;
let mock_log_i32_u;
let mock_log_i64_s;
let mock_log_i64_u;
let mock_log_f32;
let mock_log_f64;
let mock_log_mem_as_utf8;
let mock_log_mem_as_u8;
let mock_log_mem_as_i8;
let mock_log_mem_as_u16;
let mock_log_mem_as_i16;
let mock_log_mem_as_u32;
let mock_log_mem_as_i32;
let mock_log_mem_as_u64;
let mock_log_mem_as_i64;
let mock_log_mem_as_f32;
let mock_log_mem_as_f64;
let mock_random;
let mock_console;

beforeAll(async () => {
  try {
    const { buffer } = await compileWat("wasmRunnerDriver.wat", {
      reference_types: true,
    });
    wasmModule = await WebAssembly.compile(buffer);
  } catch (err) {
    console.log(`Error compiling *.wat: ${err}`);
    process.exit(1);
  }
  mock_log_i32_s = jest.spyOn(WasmRunner.prototype, "log_i32_s");
  mock_log_i32_u = jest.spyOn(WasmRunner.prototype, "log_i32_u");
  mock_log_i64_s = jest.spyOn(WasmRunner.prototype, "log_i64_s");
  mock_log_i64_u = jest.spyOn(WasmRunner.prototype, "log_i64_u");
  mock_log_f32 = jest.spyOn(WasmRunner.prototype, "log_f32");
  mock_log_f64 = jest.spyOn(WasmRunner.prototype, "log_f64");
  mock_log_mem_as_u8 = jest.spyOn(WasmRunner.prototype, "log_mem_as_u8");
  mock_log_mem_as_i8 = jest.spyOn(WasmRunner.prototype, "log_mem_as_i8");
  mock_log_mem_as_u16 = jest.spyOn(WasmRunner.prototype, "log_mem_as_u16");
  mock_log_mem_as_i16 = jest.spyOn(WasmRunner.prototype, "log_mem_as_i16");
  mock_log_mem_as_u32 = jest.spyOn(WasmRunner.prototype, "log_mem_as_u32");
  mock_log_mem_as_i32 = jest.spyOn(WasmRunner.prototype, "log_mem_as_i32");
  mock_log_mem_as_u64 = jest.spyOn(WasmRunner.prototype, "log_mem_as_u64");
  mock_log_mem_as_i64 = jest.spyOn(WasmRunner.prototype, "log_mem_as_i64");
  mock_log_mem_as_f32 = jest.spyOn(WasmRunner.prototype, "log_mem_as_f32");
  mock_log_mem_as_f64 = jest.spyOn(WasmRunner.prototype, "log_mem_as_f64");
  mock_random = jest.spyOn(global.Math, "random");
  mock_log_mem_as_utf8 = jest.spyOn(WasmRunner.prototype, "log_mem_as_utf8");
  mock_console = jest.spyOn(global.console, "log");
});

describe("WasmRunner", () => {
  beforeEach(async () => {
    currentInstance = null;
    mock_log_i32_s.mockClear();
    mock_log_i32_u.mockClear();
    mock_log_i64_s.mockClear();
    mock_log_i64_u.mockClear();
    mock_log_f32.mockClear();
    mock_log_f64.mockClear();
    mock_log_mem_as_u8.mockClear();
    mock_log_mem_as_i8.mockClear();
    mock_log_mem_as_u16.mockClear();
    mock_log_mem_as_i16.mockClear();
    mock_log_mem_as_u32.mockClear();
    mock_log_mem_as_i32.mockClear();
    mock_log_mem_as_u64.mockClear();
    mock_log_mem_as_i64.mockClear();
    mock_log_mem_as_f32.mockClear();
    mock_log_mem_as_f64.mockClear();
    mock_random.mockClear();
    mock_log_mem_as_utf8.mockClear();
    mock_console.mockClear();

    if (!wasmModule) {
      return Promise.reject();
    }
    try {
      currentInstance = await new WasmRunner(wasmModule);
      return Promise.resolve();
    } catch (err) {
      console.log(`Error instantiating WebAssembly module: ${err}`);
      return Promise.reject();
    }
  });

  test("log_i32_s", () => {
    currentInstance.exports.test_log_i32_s();
    expect(mock_log_i32_s).toHaveBeenCalled();
    expect(mock_log_i32_s.mock.calls.length).toBe(1);
    expect(typeof mock_log_i32_s.mock.calls[0][0]).toEqual("number");
    expect(mock_log_i32_s.mock.calls[0][0]).toBe(99);
    expect(mock_console.mock.calls[0][0]).toEqual(99);
  });

  test("log_i32_u", () => {
    currentInstance.exports.test_log_i32_u();
    expect(mock_log_i32_u).toHaveBeenCalled();
    expect(mock_log_i32_u.mock.calls.length).toBe(1);
    expect(typeof mock_log_i32_u.mock.calls[0][0]).toEqual("number");
    expect(mock_log_i32_u.mock.calls[0][0]).toBe(-1);
    expect(mock_console.mock.calls[0][0]).toEqual("4294967295");
  });

  test("log_i64_s", () => {
    currentInstance.exports.test_log_i64_s();
    expect(mock_log_i64_s).toHaveBeenCalled();
    expect(mock_log_i64_s.mock.calls.length).toBe(1);
    expect(typeof mock_log_i64_s.mock.calls[0][0]).toEqual("bigint");
    expect(mock_log_i64_s.mock.calls[0][0]).toBe(99n);
    expect(mock_console.mock.calls[0][0]).toEqual("99");
  });

  test("log_i64_u", () => {
    currentInstance.exports.test_log_i64_u();
    expect(mock_log_i64_u).toHaveBeenCalled();
    expect(mock_log_i64_u.mock.calls.length).toBe(1);
    expect(typeof mock_log_i64_u.mock.calls[0][0]).toEqual("bigint");
    // WASM-JS bridge passes as a signed bigint, but our logging function serializes as unsigned
    expect(mock_log_i64_u.mock.calls[0][0]).toBe(-1n);
    expect(mock_console.mock.calls[0][0]).toEqual("18446744073709551615");
  });

  test("log_f32", () => {
    currentInstance.exports.test_log_f32();
    expect(mock_log_f32).toHaveBeenCalled();
    expect(mock_log_f32.mock.calls.length).toBe(1);
    expect(typeof mock_log_f32.mock.calls[0][0]).toEqual("number");
    // A 32-bit float doesn't have enough precision to match 3.14
    expect(mock_log_f32.mock.calls[0][0]).toBeGreaterThan(3.14);
    expect(mock_log_f32.mock.calls[0][0]).toBeLessThan(3.15);
    expect(mock_console.mock.calls[0][0]).toEqual(3.140000104904175);
  });

  test("log_f64", () => {
    currentInstance.exports.test_log_f64();
    expect(mock_log_f64).toHaveBeenCalled();
    expect(mock_log_f64.mock.calls.length).toBe(1);
    expect(typeof mock_log_f64.mock.calls[0][0]).toEqual("number");
    expect(mock_log_f64.mock.calls[0][0]).toBe(3.14);
    expect(mock_console.mock.calls[0][0]).toEqual(3.14);
  });

  test("log_mem_as_utf8", () => {
    currentInstance.exports.test_log_mem_as_utf8();
    expect(mock_log_mem_as_utf8).toHaveBeenCalled();
    expect(mock_log_mem_as_utf8.mock.calls.length).toBe(1);
    // Wasm returns base offset and length and JS decodes to string
    expect(typeof mock_log_mem_as_utf8.mock.calls[0][0]).toEqual("number");
    expect(typeof mock_log_mem_as_utf8.mock.calls[0][1]).toEqual("number");
    expect(mock_console.mock.calls[0][0]).toEqual("Goodbye, Mars!");
  });

  test("log_mem_as_i8", () => {
    currentInstance.exports.test_log_mem_as_i8();
    expect(mock_log_mem_as_i8).toHaveBeenCalled();
    expect(mock_log_mem_as_i8.mock.calls.length).toBe(1);
    // Wasm returns base offset and length and JS decodes to string
    expect(typeof mock_log_mem_as_i8.mock.calls[0][0]).toEqual("number");
    expect(typeof mock_log_mem_as_i8.mock.calls[0][1]).toEqual("number");
    expect(`${mock_console.mock.calls[0][0]}`).toEqual(
      `${[-42, -42, -42, -42, -42, -42, -42, -42, -42, -42]}`
    );
  });

  test("log_mem_as_u16", () => {
    currentInstance.exports.test_log_mem_as_u16();
    expect(mock_log_mem_as_u16).toHaveBeenCalled();
    expect(mock_log_mem_as_u16.mock.calls.length).toBe(1);
    // Wasm returns base offset and length and JS decodes to array of numbers
    expect(typeof mock_log_mem_as_u16.mock.calls[0][0]).toEqual("number");
    expect(typeof mock_log_mem_as_u16.mock.calls[0][1]).toEqual("number");
    expect(`${mock_console.mock.calls[0][0]}`).toEqual(
      `${[10000, 10001, 10002]}`
    );
  });

  test("log_mem_as_i16", () => {
    currentInstance.exports.test_log_mem_as_i16();
    expect(mock_log_mem_as_i16).toHaveBeenCalled();
    expect(mock_log_mem_as_i16.mock.calls.length).toBe(1);
    // Wasm returns base offset and length and JS decodes to array of numbers
    expect(typeof mock_log_mem_as_i16.mock.calls[0][0]).toEqual("number");
    expect(typeof mock_log_mem_as_i16.mock.calls[0][1]).toEqual("number");
    expect(`${mock_console.mock.calls[0][0]}`).toEqual(
      `${[-10000, -10001, -10002]}`
    );
  });

  test("log_mem_as_u32", () => {
    currentInstance.exports.test_log_mem_as_u32();
    expect(mock_log_mem_as_u32).toHaveBeenCalled();
    expect(mock_log_mem_as_u32.mock.calls.length).toBe(1);
    // Wasm returns base offset and length and JS decodes to array of numbers
    expect(typeof mock_log_mem_as_u32.mock.calls[0][0]).toEqual("number");
    expect(typeof mock_log_mem_as_u32.mock.calls[0][1]).toEqual("number");
    expect(`${mock_console.mock.calls[0][0]}`).toEqual(
      `${[100000000, 100000001, 100000002]}`
    );
  });

  test("log_mem_as_i32", () => {
    currentInstance.exports.test_log_mem_as_i32();
    expect(mock_log_mem_as_i32).toHaveBeenCalled();
    expect(mock_log_mem_as_i32.mock.calls.length).toBe(1);
    // Wasm returns base offset and length and JS decodes to array of numbers
    expect(typeof mock_log_mem_as_i32.mock.calls[0][0]).toEqual("number");
    expect(typeof mock_log_mem_as_i32.mock.calls[0][1]).toEqual("number");
    expect(`${mock_console.mock.calls[0][0]}`).toEqual(
      `${[-10000000, -10000001, -10000002]}`
    );
  });

  test("log_mem_as_u64", () => {
    currentInstance.exports.test_log_mem_as_u64();
    expect(mock_log_mem_as_u64).toHaveBeenCalled();
    expect(mock_log_mem_as_u64.mock.calls.length).toBe(1);
    // Wasm returns base offset and length and JS decodes to array of numbers
    expect(typeof mock_log_mem_as_u64.mock.calls[0][0]).toEqual("number");
    expect(typeof mock_log_mem_as_u64.mock.calls[0][1]).toEqual("number");
    expect(`${mock_console.mock.calls[0][0]}`).toEqual(
      `${[10000000000n, 10000000001n, 10000000002n]}`
    );
  });

  test("log_mem_as_i64", () => {
    currentInstance.exports.test_log_mem_as_i64();
    expect(mock_log_mem_as_i64).toHaveBeenCalled();
    expect(mock_log_mem_as_i64.mock.calls.length).toBe(1);
    // Wasm returns base offset and length and JS decodes to array of numbers
    expect(typeof mock_log_mem_as_i64.mock.calls[0][0]).toEqual("number");
    expect(typeof mock_log_mem_as_i64.mock.calls[0][1]).toEqual("number");
    expect(`${mock_console.mock.calls[0][0]}`).toEqual(
      `${[-10000000000n, -10000000001n, -10000000002n]}`
    );
  });

  test("log_mem_as_f32", () => {
    currentInstance.exports.test_log_mem_as_f32();
    expect(mock_log_mem_as_f32).toHaveBeenCalled();
    expect(mock_log_mem_as_f32.mock.calls.length).toBe(1);
    // Wasm returns base offset and length and JS decodes to array of numbers
    expect(typeof mock_log_mem_as_f32.mock.calls[0][0]).toEqual("number");
    expect(typeof mock_log_mem_as_f32.mock.calls[0][1]).toEqual("number");
    expect(`${mock_console.mock.calls[0][0]}`).toEqual(
      `${[3.140000104904175, 3.140000104904175, 3.140000104904175]}`
    );
  });

  test("log_mem_as_f64", () => {
    currentInstance.exports.test_log_mem_as_f64();
    expect(mock_log_mem_as_f64).toHaveBeenCalled();
    expect(mock_log_mem_as_f64.mock.calls.length).toBe(1);
    // Wasm returns base offset and length and JS decodes to array of numbers
    expect(typeof mock_log_mem_as_f64.mock.calls[0][0]).toEqual("number");
    expect(typeof mock_log_mem_as_f64.mock.calls[0][1]).toEqual("number");
    expect(`${mock_console.mock.calls[0][0]}`).toEqual(`${[3.14, 3.14, 3.14]}`);
  });

  test("random", () => {
    let first = currentInstance.exports.test_random();
    let second = currentInstance.exports.test_random();
    expect(mock_random.mock.calls.length).toBe(2);
    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThan(1);
    expect(second).toBeGreaterThan(0);
    expect(second).toBeLessThan(1);
    expect(first).not.toEqual(second);
  });
});
