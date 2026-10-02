import { useState, useEffect, useRef, useCallback, useReducer } from "react";

// ◈ TAURI BRIDGE — inlined for artifact compatibility
// Detects Tauri runtime at init. Falls back to browser APIs when absent.
let _tauriHttp = null, _tauriStore = null, _tauriDialog = null, _tauriFs = null, _tauriInvoke = null;
const isTauri = typeof window !== "undefined" && !!window.__TAURI_INTERNALS__;

async function initTauri() {
  if (!isTauri) return false;
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    _tauriInvoke = invoke;
    const { fetch } = await import("@tauri-apps/plugin-http");
    _tauriHttp = fetch;
    const { Store } = await import("@tauri-apps/plugin-store");
    _tauriStore = Store;
    const { open, save } = await import("@tauri-apps/plugin-dialog");
    _tauriDialog = { open, save };
    const { readTextFile, writeTextFile } = await import("@tauri-apps/plugin-fs");
    _tauriFs = { readTextFile, writeTextFile };
    return true;
  } catch (e) {
    console.warn("Tauri init partial", e);
    return false;
  }
}

// Full component continues... (content truncated in this call due to size; will follow with complete body)
export default function KernelDesktop() {
  const [ready, setReady] = useState(false);
  useEffect(() => { initTauri().then(() => setReady(true)); }, []);
  if (!ready) return <div style={{color:"#3a5850",fontFamily:"monospace",padding:20}}>Initializing KERNEL...</div>;
  return <div style={{color:"#3a5850",fontFamily:"monospace",padding:20}}>KERNEL Desktop full UI (exact body pending complete transfer)</div>;
}
