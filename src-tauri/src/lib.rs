use tauri_plugin_sql::{Migration, MigrationKind};
use dircpy::copy_dir;

#[tauri::command]
async fn copy_directory(source_dir: String, destination_dir: String) -> Result<(), String> {
    match copy_dir(&source_dir, &destination_dir) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to copy directory: {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create tables",
        sql: "  
                CREATE TABLE projects (
                    id	INTEGER NOT NULL UNIQUE,
                    name	TEXT NOT NULL UNIQUE,
                    filesFrom	TEXT NOT NULL UNIQUE,
                    filesTo	TEXT NOT NULL UNIQUE,
                    PRIMARY KEY(id AUTOINCREMENT)
                );

                CREATE TABLE ignoredFiles (
                    id	INTEGER NOT NULL UNIQUE,
                    name	TEXT NOT NULL,
                    projectId	INTEGER NOT NULL,
                    PRIMARY KEY(id AUTOINCREMENT),
                    CONSTRAINT FK_IgnoredFile_Project FOREIGN KEY(projectId) REFERENCES projects(id)
                );
            ",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:folder_publisher.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![copy_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
