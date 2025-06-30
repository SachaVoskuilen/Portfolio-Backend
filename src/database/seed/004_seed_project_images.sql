INSERT INTO project_image (project_group_id, image_url, alt_text, sort_order) VALUES
  -- image_id: 1 (for Portfolio Website)
  ((SELECT project_group_id FROM project_group WHERE slug = 'portfolio-website'), 'https://images.pexels.com/photos/15586829/pexels-photo-15586829.jpeg', 'Main screenshot of portfolio website', 1),
  -- image_id: 2 (for Portfolio Website)
  ((SELECT project_group_id FROM project_group WHERE slug = 'portfolio-website'), 'https://images.pexels.com/photos/30554496/pexels-photo-30554496.jpeg', 'About page of portfolio website', 2),
  -- image_id: 3 (for Portfolio Website)
  ((SELECT project_group_id FROM project_group WHERE slug = 'portfolio-website'), 'https://images.pexels.com/photos/6796584/pexels-photo-6796584.jpeg', 'Projects page of portfolio website', 3),

  -- image_id: 4 (for E-commerce Platform)
  ((SELECT project_group_id FROM project_group WHERE slug = 'e-commerce-platform'), 'https://images.pexels.com/photos/31159549/pexels-photo-31159549.jpeg', 'Homepage of e-commerce platform', 1),
  -- image_id: 5 (for E-commerce Platform)
  ((SELECT project_group_id FROM project_group WHERE slug = 'e-commerce-platform'), 'https://images.pexels.com/photos/7148374/pexels-photo-7148374.jpeg', 'Product detail page of e-commerce platform', 2),
  -- image_id: 6 (for E-commerce Platform)
  ((SELECT project_group_id FROM project_group WHERE slug = 'e-commerce-platform'), 'https://images.pexels.com/photos/6796606/pexels-photo-6796606.jpeg', 'Shopping cart of e-commerce platform', 3),

  -- image_id: 7 (for Mobile Game Development)
  ((SELECT project_group_id FROM project_group WHERE slug = 'mobile-game-dev'), 'https://images.pexels.com/photos/32519018/pexels-photo-32519018.png', 'Screenshot of mobile game level 1', 1),
  -- image_id: 8 (for Mobile Game Development)
  ((SELECT project_group_id FROM project_group WHERE slug = 'mobile-game-dev'), 'https://images.pexels.com/photos/6796583/pexels-photo-6796583.jpeg', 'Screenshot of mobile game character selection', 2);