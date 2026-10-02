# ◈ KERNEL Desktop

**Version 3.0.0** · Tauri 2 + React 18 + Vite

Native desktop shell for the KERNEL cognitive operating environment.

A dark, high-density terminal-inspired interface that unifies multi-agent orchestration, policy enforcement, chat, research, data analysis, and hardware workflows under a single window.

---

## What it is

KERNEL Desktop is a Tauri 2 application that packages a large single-file React UI (`src/KernelDesktop.jsx`) together with a minimal Rust backend.  
It is designed to run both as a native desktop app **and** as a browser fallback when Tauri APIs are unavailable.

### Core capabilities visible in the UI

| Domain | Description |
|--------|-------------|
| **Chat / Multi-agent** | Route tasks across specialized KERNEL roles (DATA, RESEARCH, HW, etc.) |
| **Policy engine** | Visual policy cards, authority levels, and constraint guards |
| **Agent sidebar** | Live agent list, history, eco chips, new-chat controls |
| **System bridge** | Tauri invoke + plugins (HTTP, FS, Dialog, Store, Shell) with graceful browser fallback |
| **Config persistence** | Tauri Store (`kernel-config.json`) or `localStorage` fallback |
| **Threat / chaos testing** | Built-in vectors (e.g. CL-1 Authority & Trust Subversion) and scenario cycles |

The visual language is deliberately monospace / jet-black / cyan (`#00ffd5`) — a “command deck” aesthetic.

---

## Architecture

```
kernel-desktop/
├── index.html                 # Minimal shell, #root mount
├── package.json               # React 18 + Tauri 2 plugins
├── vite.config.js             # Vite + React plugin, port 5173
├── src/
│   ├── main.jsx               # ReactDOM entry → <KernelDesktop />
│   └── KernelDesktop.jsx      # Entire UI + Tauri bridge (≈189 kB)
└── src-tauri/
    ├── Cargo.toml             # Tauri 2 + plugins
    ├── tauri.conf.json        # Window 1400×900, CSP, plugin scopes
    ├── capabilities/default.json
    ├── build.rs
    └── src/
        ├── lib.rs             # get_system_info command + plugin wiring
        └── main.rs
```

### Tauri Bridge (inlined)

`KernelDesktop.jsx` contains a self-contained bridge that:

1. Detects `window.__TAURI_INTERNALS__`
2. Dynamically imports `@tauri-apps/api/core` + plugins
3. Falls back to browser `fetch` / `localStorage` when running outside Tauri

This makes the same artifact usable for both desktop packaging and pure web preview.

---

## Prerequisites

| Tool | Version / Notes |
|------|-----------------|
| **Node.js** | ≥ 18 (tested on 24) |
| **npm** | ≥ 9 |
| **Rust** | ≥ 1.77 recommended (1.75 may fail on some Tauri 2 transitive crates requiring `edition2024`) |
| **Tauri CLI** | `npm install -g @tauri-apps/cli` or use local `npx tauri` |
| **System deps** | See [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your OS |

---

## Quick start

```bash
# 1. Install frontend dependencies
npm install

# 2. Dev mode (Vite only – browser)
npm run dev
# → http://localhost:5173

# 3. Full desktop (Tauri)
npm run tauri dev
```

### Production build

```bash
npm run tauri build
```

Artifacts appear under `src-tauri/target/release/bundle/`.

---

## Known issues / TODOs (as of this README)

1. **Export name mismatch**  
   `src/KernelDesktop.jsx` currently exports `KernelV3`, while `src/main.jsx` imports `KernelDesktop`.  
   Fix: rename the default export (or the import) so they match.

2. **Rust toolchain**  
   Cargo check on Rust 1.75 can fail because some dependency crates now require `edition2024`.  
   Upgrade to a recent stable Rust (≥ 1.80 / 1.81) if you hit this.

3. **Icons**  
   `tauri.conf.json` references icon files that are not yet present in the repository.  
   Add `src-tauri/icons/` (32×32, 128×128, etc.) before shipping a release bundle.

4. **Large single-file component**  
   All UI logic lives in one 189 kB JSX file. Future work may split it into proper modules for maintainability.

---

## Configuration & permissions

- **Window**: 1400 × 900, min 900 × 600, centered, resizable  
- **CSP**: Allows self + HTTPS + localhost / private LAN  
- **FS scope**: `$APPDATA/**` and `$HOME/.kernel/**`  
- **HTTP scope**: HTTPS anywhere + localhost + common private ranges  
- **Store**: Persistent key-value (`kernel-config.json`)  
- **Shell**: `open` permission enabled  

See `src-tauri/tauri.conf.json` and `src-tauri/capabilities/default.json` for the full capability set.

---

## Development notes

- The UI is intentionally dense and keyboard-oriented.  
- All styling is inline (no CSS modules / Tailwind) for maximum portability of the single JSX artifact.  
- When running under Tauri, the bridge opens DevTools automatically in debug builds.  
- System info is exposed via the Rust command `get_system_info`.

---

## License & authorship

© 2026 Benjamin Hubbard / Terracare Inc.  
All rights reserved. Not licensed for redistribution unless explicitly stated otherwise.

---

**◈ KERNEL** — command deck for multi-agent cognition.
