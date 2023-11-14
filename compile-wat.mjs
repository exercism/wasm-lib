import { readFileSync } from "node:fs";
import initWabt from "wabt";

let defaultWabtOptions = {
  exceptions: true,
  mutable_globals: true,
  sat_float_to_int: true,
  sign_extension: true,
  simd: true,
  threads: false,
  function_references: true,
  multi_value: true,
  bulk_memory: true,
  reference_types: true,
  annotations: true,
  code_metadata: true,
  gc: false,
  memory64: false,
};

// Reads a *.wat file, parses to a *.wasm binary in-memory, and then compiles to a Wasm module we can instantiate
export async function compileWat(watPath, optionsOverrides) {
  const wabt = await initWabt();
  const module = wabt.parseWat(watPath, readFileSync(watPath, "utf8"), {
    ...defaultWabtOptions,
    ...optionsOverrides,
  });
  // Call validate on the text format so errors highlight source WAT
  module.validate();

  return module.toBinary({ write_debug_names: true });
}
