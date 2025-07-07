CREATE TABLE project_entry (
    project_entry_id SERIAL PRIMARY KEY,
    project_group_id INTEGER NOT NULL REFERENCES project_group(project_group_id) ON DELETE CASCADE,
    language_id INTEGER NOT NULL REFERENCES language(language_id) ON DELETE CASCADE,
    part INTEGER NOT NULL,
    title VARCHAR(255),
    text TEXT NOT NULL,
    UNIQUE (project_group_id, language_id, part)
);