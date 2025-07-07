CREATE TABLE about_me_entry (
    about_me_entry_id SERIAL PRIMARY KEY,
    about_me_group_id INTEGER NOT NULL REFERENCES about_me_group(about_me_group_id) ON DELETE CASCADE,
    language_id INTEGER NOT NULL REFERENCES language(language_id) ON DELETE CASCADE,
    part INTEGER NOT NULL,
    title VARCHAR(255),
    text TEXT NOT NULL,
    UNIQUE (about_me_group_id, language_id, part)
);