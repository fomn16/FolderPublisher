use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create tables",
        sql: "  
                CREATE TABLE chats (
                    id	INTEGER NOT NULL UNIQUE,
                    name	TEXT NOT NULL UNIQUE,
                    PRIMARY KEY(id AUTOINCREMENT)
                );

                CREATE TABLE messages (
                    id	INTEGER NOT NULL UNIQUE,
                    content	TEXT NOT NULL,
                    chatId	INTEGER NOT NULL,
                    issuer INTEGER NOT NULL,
                    PRIMARY KEY(id AUTOINCREMENT),
                    CONSTRAINT FK_IgnoredFile_Chat FOREIGN KEY(chatId) REFERENCES chats(id)
                );
            ",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:example_app.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
