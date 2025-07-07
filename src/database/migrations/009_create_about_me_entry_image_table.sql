CREATE TABLE about_me_entry_image (
    about_me_entry_id INTEGER NOT NULL REFERENCES about_me_entry(about_me_entry_id) ON DELETE CASCADE,
    image_id INTEGER NOT NULL REFERENCES about_me_image(image_id) ON DELETE CASCADE,
    PRIMARY KEY (about_me_entry_id, image_id)
);