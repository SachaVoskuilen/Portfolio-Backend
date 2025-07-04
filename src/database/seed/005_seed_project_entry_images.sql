INSERT INTO project_entry_image (project_entry_id, image_id) VALUES
  -- Portfolio Website (project_group_id = 1)
  -- Entry 1 (EN, part 1) gets image 1
  (1, 1),
  -- Entry 2 (EN, part 2) gets image 2 and 3
  (2, 2),
  (2, 3),
  -- Entry 3 (NL, part 1) gets image 1
  (3, 1),
  -- Entry 4 (NL, part 2) gets image 2 and 3
  (4, 2),
  (4, 3),

  -- E-commerce Platform (project_group_id = 2)
  -- Entry 5 (EN, part 1) gets image 4
  (5, 4),
  -- Entry 6 (EN, part 2) gets image 5
  (6, 5),
  -- Entry 7 (NL, part 1) gets image 4
  (7, 4),
  -- Entry 8 (NL, part 2) gets image 5
  (8, 5),

  -- Mobile Game Development (project_group_id = 3)
  -- Entry 9 (EN, part 1) gets image 7
  (9, 7),
  -- Entry 10 (NL, part 1) gets image 7
  (10, 7);