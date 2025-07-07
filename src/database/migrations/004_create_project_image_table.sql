CREATE TABLE project_image (
    image_id SERIAL PRIMARY KEY,
    project_group_id INTEGER NOT NULL REFERENCES project_group(project_group_id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER NOT NULL
);