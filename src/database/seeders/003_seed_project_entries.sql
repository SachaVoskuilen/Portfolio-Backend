INSERT INTO project_entry (project_group_id, language_id, part, title, text) VALUES
    -- project_entry_id: 1
    (1, (SELECT language_id FROM language WHERE code = 'EN'), 1, 'Introduction to My Portfolio', 'This project showcases my full-stack development skills, built with modern web technologies.'),
    -- project_entry_id: 2
    (1, (SELECT language_id FROM language WHERE code = 'EN'), 2, 'Technologies Used', 'Developed using Node.js, Express, PostgreSQL, and React.js for a responsive and dynamic user experience.'),
    -- project_entry_id: 3
    (1, (SELECT language_id FROM language WHERE code = 'NL'), 1, 'Introductie tot Mijn Portfolio', 'Dit project toont mijn full-stack ontwikkelvaardigheden, gebouwd met moderne webtechnologieën.'),
    -- project_entry_id: 4
    (1, (SELECT language_id FROM language WHERE code = 'NL'), 2, 'Gebruikte Technologieën', 'Ontwikkeld met Node.js, Express, PostgreSQL en React.js voor een responsieve en dynamische gebruikerservaring.'),

    -- project_group_id: 2 (E-commerce Platform)
    -- project_entry_id: 5
    (2, (SELECT language_id FROM language WHERE code = 'EN'), 1, 'Building a Scalable E-commerce Solution', 'A robust e-commerce platform designed for high traffic and secure transactions.'),
    -- project_entry_id: 6
    (2, (SELECT language_id FROM language WHERE code = 'EN'), 2, 'Key Features', 'Includes product management, shopping cart, secure payment gateway, and user authentication.'),
    -- project_entry_id: 7
    (2, (SELECT language_id FROM language WHERE code = 'NL'), 1, 'Een Schaalbaar E-commerce Platform Bouwen', 'Een robuust e-commerce platform ontworpen voor veel verkeer en veilige transacties.'),
    -- project_entry_id: 8
    (2, (SELECT language_id FROM language WHERE code = 'NL'), 2, 'Belangrijkste Kenmerken', 'Omvat productbeheer, winkelwagen, veilige betalingsgateway en gebruikersauthenticatie.'),

    -- project_group_id: 3 (Mobile Game Development)
    -- project_entry_id: 9
    (3, (SELECT language_id FROM language WHERE code = 'EN'), 1, 'Creating Engaging Mobile Games', 'Exploration into mobile game development using Unity and C#.'),
    -- project_entry_id: 10
    (3, (SELECT language_id FROM language WHERE code = 'NL'), 1, 'Boeiende Mobiele Games Creëren', 'Verkenning van mobiele game-ontwikkeling met Unity en C#.');
