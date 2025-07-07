CREATE TABLE about_me_group (
    about_me_group_id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL
);