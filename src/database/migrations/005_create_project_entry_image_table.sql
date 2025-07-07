CREATE TABLE project_entry_image (
    project_entry_id INTEGER REFERENCES project_entry(project_entry_id) ON DELETE SET NULL,
    image_id INTEGER REFERENCES project_image(image_id) ON DELETE SET NULL,
    PRIMARY KEY (project_entry_id, image_id)
);