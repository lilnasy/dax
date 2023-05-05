import { instantiate } from "./rs_lib.generated.js";

export type WasmInstance = Awaited<ReturnType<typeof instantiate>>;

const cache = await caches.open('dax')

export const wasmInstance = await loadWasm(new URL("rs_lib_bg.wasm", import.meta.url))

async function loadWasm(wasmUrl: URL) {
  const request = new Request(wasmUrl)
  if (new URL(request.url).protocol === 'file:') {
    return await instantiate({ url: wasmUrl })
  }
  const maybeCached = await cache.match(request)
  if (maybeCached === undefined) {
    const response = await fetch(wasmUrl)
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: { ...response.headers, 'Content-Type' : 'application/wasm' }
    })
    cache.put(request, newResponse.clone())
    return await instantiate({ response: newResponse })
  } 
  const response = maybeCached
  return await instantiate({ response })
}
