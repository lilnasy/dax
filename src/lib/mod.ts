import { instantiate } from "./rs_lib.generated.js";
import response from "./rs_lib_bg.wasm.js";

export type WasmInstance = Awaited<ReturnType<typeof instantiate>>;

export const wasmInstance = await instantiate({ response })
