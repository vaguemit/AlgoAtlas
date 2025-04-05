-- SQL queries to add learning path details to the database

-- Insert learning paths with proper UUID values
INSERT INTO public.learning_paths (id, title, description, difficulty, tags, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Diamond Path', 'Getting started with competitive programming for beginners. Learn the basics to launch your CP journey.', 'beginner', ARRAY['algorithms', 'data structures', 'beginner'], NOW(), NOW()),
  (gen_random_uuid(), 'Emerald Path', 'Introduction to competitive programming. Learn basic algorithms, sorting, searching, and fundamental data structures.', 'beginner', ARRAY['algorithms', 'data structures', 'beginner'], NOW(), NOW()),
  (gen_random_uuid(), 'Sapphire Path', 'Intermediate problem-solving skills. Focus on greedy algorithms, basic graph theory, and string manipulation.', 'intermediate', ARRAY['algorithms', 'data structures', 'graph theory', 'intermediate'], NOW(), NOW()), 
  (gen_random_uuid(), 'Amethyst Path', 'Advanced competitive programming. Master segment trees, advanced graph algorithms, and complex dynamic programming.', 'advanced', ARRAY['algorithms', 'advanced data structures', 'dynamic programming', 'master'], NOW(), NOW()),
  (gen_random_uuid(), 'Ruby Path', 'Expert-level algorithms and techniques. Advanced data structures, network flow, and advanced dynamic programming patterns.', 'advanced', ARRAY['algorithms', 'advanced data structures', 'advanced dynamic programming', 'expert'], NOW(), NOW());

-- Insert learning modules using proper referencing to the paths by title rather than id
-- Insert modules for Diamond Path
WITH path_id AS (SELECT id FROM public.learning_paths WHERE title = 'Diamond Path')
INSERT INTO public.learning_modules (path_id, title, description, order_index, estimated_time_minutes)
VALUES
  ((SELECT id FROM path_id), 'Introduction to Programming', 'Fundamentals of programming and algorithmic thinking.', 1, 120),
  ((SELECT id FROM path_id), 'Basic Data Structures', 'Introduction to arrays, lists, stacks, and queues.', 2, 180),
  ((SELECT id FROM path_id), 'Basic Algorithms', 'Introduction to sorting, searching, and basic problem-solving techniques.', 3, 180),
  ((SELECT id FROM path_id), 'Time and Space Complexity', 'Understanding computational complexity and Big O notation.', 4, 120);

-- Insert modules for Emerald Path
WITH path_id AS (SELECT id FROM public.learning_paths WHERE title = 'Emerald Path')
INSERT INTO public.learning_modules (path_id, title, description, order_index, estimated_time_minutes)
VALUES
  ((SELECT id FROM path_id), 'Advanced Data Structures', 'More complex data structures for efficient problem-solving.', 1, 240),
  ((SELECT id FROM path_id), 'Sorting and Searching', 'Efficient sorting and searching algorithms.', 2, 180),
  ((SELECT id FROM path_id), 'Basic Graph Algorithms', 'Introduction to graph theory and basic graph algorithms.', 3, 210),
  ((SELECT id FROM path_id), 'Introduction to Dynamic Programming', 'Learning the fundamentals of dynamic programming.', 4, 240);

-- Insert modules for Sapphire Path
WITH path_id AS (SELECT id FROM public.learning_paths WHERE title = 'Sapphire Path')
INSERT INTO public.learning_modules (path_id, title, description, order_index, estimated_time_minutes)
VALUES
  ((SELECT id FROM path_id), 'Math', 'Mathematical concepts and techniques for competitive programming.', 1, 180),
  ((SELECT id FROM path_id), 'Dynamic Programming', 'Advanced DP techniques and problem types.', 2, 240),
  ((SELECT id FROM path_id), 'Graphs', 'Advanced graph algorithms and concepts.', 3, 210),
  ((SELECT id FROM path_id), 'Data Structures', 'Advanced data structures for efficient problem-solving.', 4, 180),
  ((SELECT id FROM path_id), 'Trees', 'Advanced tree algorithms and techniques.', 5, 150),
  ((SELECT id FROM path_id), 'Additional Topics', 'Miscellaneous advanced topics.', 6, 150);

-- Insert modules for Ruby Path
WITH path_id AS (SELECT id FROM public.learning_paths WHERE title = 'Ruby Path')
INSERT INTO public.learning_modules (path_id, title, description, order_index, estimated_time_minutes)
VALUES
  ((SELECT id FROM path_id), 'Advanced Data Structures', 'Specialized data structures for complex problems.', 1, 240),
  ((SELECT id FROM path_id), 'Advanced Dynamic Programming', 'Complex dynamic programming techniques and paradigms.', 2, 300),
  ((SELECT id FROM path_id), 'Flow Networks', 'Network flow algorithms and applications.', 3, 210),
  ((SELECT id FROM path_id), 'Advanced Graph Algorithms', 'Specialized graph algorithms and techniques.', 4, 240),
  ((SELECT id FROM path_id), 'Strings', 'Advanced string algorithms and data structures.', 5, 180);

-- Insert modules for Amethyst Path
WITH path_id AS (SELECT id FROM public.learning_paths WHERE title = 'Amethyst Path')
INSERT INTO public.learning_modules (path_id, title, description, order_index, estimated_time_minutes)
VALUES
  ((SELECT id FROM path_id), 'Advanced Data Structures', 'Complex data structures for competitive programming.', 1, 300),
  ((SELECT id FROM path_id), 'Advanced Graph Algorithms', 'Complex graph algorithms and techniques.', 2, 270),
  ((SELECT id FROM path_id), 'Advanced Dynamic Programming', 'Complex DP patterns and optimizations.', 3, 300),
  ((SELECT id FROM path_id), 'Computational Geometry', 'Algorithms for computational geometry problems.', 4, 240),
  ((SELECT id FROM path_id), 'String Algorithms', 'Advanced string algorithms and data structures.', 5, 210);

-- Insert learning items for various modules
-- The following assumes that the module insertions above have been executed

-- Insert items for Diamond Path Introduction to Programming
WITH module_id AS (
  SELECT m.id 
  FROM public.learning_modules m
  JOIN public.learning_paths p ON m.path_id = p.id
  WHERE p.title = 'Diamond Path' AND m.title = 'Introduction to Programming'
)
INSERT INTO public.learning_items (module_id, title, type, content, order_index, external_url)
VALUES 
  ((SELECT id FROM module_id), 'Getting Started with Programming', 'article', 'Introduction to programming concepts and syntax.', 1, 'https://www.geeksforgeeks.org/introduction-to-programming-languages/'),
  ((SELECT id FROM module_id), 'Variables and Data Types', 'article', 'Understanding different types of data and how to store them.', 2, 'https://www.geeksforgeeks.org/variables-and-types-in-javascript/'),
  ((SELECT id FROM module_id), 'Control Flow', 'article', 'Using conditionals and loops to control program execution.', 3, 'https://www.geeksforgeeks.org/control-flow-in-javascript/'),
  ((SELECT id FROM module_id), 'Functions and Modular Code', 'article', 'Writing reusable code blocks and organizing your code.', 4, 'https://www.geeksforgeeks.org/functions-in-javascript/');

-- Insert items for Diamond Path Basic Data Structures
WITH module_id AS (
  SELECT m.id 
  FROM public.learning_modules m
  JOIN public.learning_paths p ON m.path_id = p.id
  WHERE p.title = 'Diamond Path' AND m.title = 'Basic Data Structures'
)
INSERT INTO public.learning_items (module_id, title, type, content, order_index, external_url)
VALUES 
  ((SELECT id FROM module_id), 'Arrays and Lists', 'article', 'Working with collections of data items.', 1, 'https://www.geeksforgeeks.org/array-data-structure/'),
  ((SELECT id FROM module_id), 'Stacks and Queues', 'article', 'Understanding LIFO and FIFO data structures.', 2, 'https://www.geeksforgeeks.org/stack-data-structure-introduction-program/'),
  ((SELECT id FROM module_id), 'Hash Tables', 'article', 'Efficient key-value storage and retrieval.', 3, 'https://www.geeksforgeeks.org/hashing-data-structure/'),
  ((SELECT id FROM module_id), 'Basic Tree Structures', 'article', 'Introduction to hierarchical data structures.', 4, 'https://www.geeksforgeeks.org/binary-tree-data-structure/');

-- Continue with similar patterns for other modules' items

-- Example query to get all learning paths with their modules and items
/*
SELECT 
  lp.id as path_id, 
  lp.title as path_title, 
  lp.description as path_description,
  lm.id as module_id, 
  lm.title as module_title, 
  lm.description as module_description,
  li.id as item_id,
  li.title as item_title,
  li.type as item_type,
  li.content as item_content,
  li.external_url
FROM 
  public.learning_paths lp
LEFT JOIN 
  public.learning_modules lm ON lp.id = lm.path_id
LEFT JOIN 
  public.learning_items li ON lm.id = li.module_id
ORDER BY 
  lp.title, lm.order_index, li.order_index;
*/