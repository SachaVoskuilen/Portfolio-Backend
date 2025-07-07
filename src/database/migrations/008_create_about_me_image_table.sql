CREATE TABLE about_me_image (
    image_id SERIAL PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER NOT NULL
);