CREATE TABLE project_group (
    project_group_id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    is_public BOOLEAN DEFAULT TRUE
);