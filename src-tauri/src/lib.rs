use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo { pub os: String, pub arch: String, pub version: String }
#[tauri::command]
fn get_system_info() -> SystemInfo {
    SystemInfo { os: std::env::consts::OS.into(), arch: std::env::consts::ARCH.into(), version: env!("CARGO_PKG_VERSION").into() }
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![get_system_info])
        .setup(|_app| {
            #[cfg(debug_assertions)]
            { use tauri::Manager; _app.get_webview_window("main").unwrap().open_devtools(); }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error running Kernel Desktop");
}
