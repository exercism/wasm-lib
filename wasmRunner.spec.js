// @ts-check

import { compileWat } from "./compile-wat.js";
// @ts-ignore
import { WasmRunner } from "./wasmRunner.js";

let wasmModule;
let currentInstance;

beforeAll(async () => {
  try {
    const { buffer } = await compileWat("log-all.wat", {
      reference_types: true,
    });
    wasmModule = await WebAssembly.compile(buffer);
  } catch (err) {
    console.log(`Error compiling *.wat: ${err}`);
    process.exit(1);
  }
});

describe("CircularBuffer", () => {
  beforeEach(async () => {
    currentInstance = null;

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

  test("reading empty buffer should fail", () => {
    expect(currentInstance.exports.logAll()).toEqual(0);
  });
});
