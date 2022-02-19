import { readFileSync } from "node:fs";
import initWabt from "wabt";

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

// Reads a *.wat file, parses to a *.wasm binary in-memory, and then compiles to a Wasm module we can instantiate
export async function compileWat(watPath, optionsOverrides) {
  const wabt = await initWabt();
  return wabt
    .parseWat(watPath, readFileSync(watPath, "utf8"), {
      ...defaultWabtOptions,
      ...optionsOverrides,
    })
    .toBinary({ write_debug_names: true });
}
