use std::process::Command;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::{Emitter, Manager, WebviewWindow};
use tauri_plugin_autostart::MacosLauncher;

#[tauri::command]
fn lock_screen() -> Result<(), String> {
    let output = Command::new("pmset")
        .arg("displaysleepnow")
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).into_owned());
    }

    Ok(())
}

#[tauri::command]
fn start_timer(window: WebviewWindow) {
    window.emit("start-timer", ()).unwrap();
}

#[tauri::command]
fn pause_timer(window: WebviewWindow) {
    window.emit("pause-timer", ()).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let quit_i = MenuItem::with_id(app, "exit", "退出StandUp", true, None::<&str>)?;
            let settings_i = MenuItem::with_id(app, "settings", "设置", true, None::<&str>)?;
            let start_timer_i = MenuItem::with_id(app, "start_timer", "开始计时", true, None::<&str>)?;
            let pause_timer_i = MenuItem::with_id(app, "pause_timer", "暂停计时", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&start_timer_i, &pause_timer_i, &settings_i, &quit_i])?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .menu_on_left_click(true)
                .on_menu_event(move |app, event| {
                    let window = app.get_webview_window("main").unwrap();
                    match event.id().0.as_str() {
                        "exit" => app.exit(0),
                        "settings" => {
                            let _show = window.show();
                        },
                        "start_timer" => {
                            start_timer(window);
                        },
                        "pause_timer" => {
                            pause_timer(window);
                        },
                        _ => {}
                    }
                })
                .build(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![lock_screen, start_timer, pause_timer])
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
