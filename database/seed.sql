-- Emberly demo data (dummy data only)
PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- users (9 rows)
INSERT INTO users (id, name, email, password_hash, role, bio, created_at) VALUES (1, 'Fiza Saleem', 'admin@emberly.test', '$2b$10$EET.pWCIDJrc3zo2rShGkeC43kZTZs6bRwkT5kWqHQKfKZJGtksuS', 'admin', 'Site administrator', '2026-09-17 05:00:00');
INSERT INTO users (id, name, email, password_hash, role, bio, created_at) VALUES (2, 'Ayesha Rahman', 'instructor1@emberly.test', '$2b$10$406CM2rrHySW5Jk46albWOvTwN2h1XCTU0BLnIDXtgfzLWbfF2aX.', 'instructor', 'Web developer and teacher.', '2026-09-22 05:00:00');
INSERT INTO users (id, name, email, password_hash, role, bio, created_at) VALUES (3, 'Bilal Ahmed', 'instructor2@emberly.test', '$2b$10$406CM2rrHySW5Jk46albWOvTwN2h1XCTU0BLnIDXtgfzLWbfF2aX.', 'instructor', 'Software engineer who loves Python and React.', '2026-09-23 05:00:00');
INSERT INTO users (id, name, email, password_hash, role, bio, created_at) VALUES (4, 'Hira Anwar', 'instructor3@emberly.test', '$2b$10$406CM2rrHySW5Jk46albWOvTwN2h1XCTU0BLnIDXtgfzLWbfF2aX.', 'instructor', 'UI/UX designer and data enthusiast.', '2026-09-24 05:00:00');
INSERT INTO users (id, name, email, password_hash, role, bio, created_at) VALUES (5, 'Sara Khan', 'student@emberly.test', '$2b$10$xq1TYNLqa50/bAyaDli73.u88jmn5ZGiBNYdSmbJuR5fY7cM/.wsi', 'student', NULL, '2026-10-07 05:00:00');
INSERT INTO users (id, name, email, password_hash, role, bio, created_at) VALUES (6, 'Ali Raza', 'ali@emberly.test', '$2b$10$xq1TYNLqa50/bAyaDli73.u88jmn5ZGiBNYdSmbJuR5fY7cM/.wsi', 'student', NULL, '2026-10-08 05:00:00');
INSERT INTO users (id, name, email, password_hash, role, bio, created_at) VALUES (7, 'Maham Tariq', 'maham@emberly.test', '$2b$10$xq1TYNLqa50/bAyaDli73.u88jmn5ZGiBNYdSmbJuR5fY7cM/.wsi', 'student', NULL, '2026-10-09 05:00:00');
INSERT INTO users (id, name, email, password_hash, role, bio, created_at) VALUES (8, 'Usman Sheikh', 'usman@emberly.test', '$2b$10$xq1TYNLqa50/bAyaDli73.u88jmn5ZGiBNYdSmbJuR5fY7cM/.wsi', 'student', NULL, '2026-10-10 05:00:00');
INSERT INTO users (id, name, email, password_hash, role, bio, created_at) VALUES (9, 'Zoya Farooq', 'zoya@emberly.test', '$2b$10$xq1TYNLqa50/bAyaDli73.u88jmn5ZGiBNYdSmbJuR5fY7cM/.wsi', 'student', NULL, '2026-10-11 05:00:00');

-- categories (4 rows)
INSERT INTO categories (id, name, slug) VALUES (1, 'Web Development', 'web-development');
INSERT INTO categories (id, name, slug) VALUES (2, 'Python and Data', 'python-and-data');
INSERT INTO categories (id, name, slug) VALUES (3, 'Design', 'design');
INSERT INTO categories (id, name, slug) VALUES (4, 'Career Skills', 'career-skills');

-- courses (9 rows)
INSERT INTO courses (id, title, description, level, category_id, instructor_id, status, created_at) VALUES (1, 'HTML and CSS Basics', 'Build your first web page from scratch. Learn tags, styling and modern layouts.', 'beginner', 1, 2, 'published', '2026-09-27 05:00:00');
INSERT INTO courses (id, title, description, level, category_id, instructor_id, status, created_at) VALUES (2, 'JavaScript for Beginners', 'Learn the core ideas of JavaScript: variables, functions and how to make pages interactive.', 'beginner', 1, 2, 'published', '2026-09-28 05:00:00');
INSERT INTO courses (id, title, description, level, category_id, instructor_id, status, created_at) VALUES (3, 'React Fundamentals', 'Understand components, state and effects, the three ideas behind every React app.', 'intermediate', 1, 3, 'published', '2026-09-29 05:00:00');
INSERT INTO courses (id, title, description, level, category_id, instructor_id, status, created_at) VALUES (4, 'Python Basics', 'Start programming with Python. Learn printing, lists, loops and functions with simple examples.', 'beginner', 2, 3, 'published', '2026-09-30 05:00:00');
INSERT INTO courses (id, title, description, level, category_id, instructor_id, status, created_at) VALUES (5, 'SQL and Databases', 'Learn how databases store data and how to read it with SELECT, WHERE and JOIN.', 'intermediate', 2, 4, 'published', '2026-10-01 05:00:00');
INSERT INTO courses (id, title, description, level, category_id, instructor_id, status, created_at) VALUES (6, 'UI/UX Design Basics', 'Learn how to make websites that are clear, readable and pleasant to use on any screen.', 'beginner', 3, 4, 'published', '2026-10-02 05:00:00');
INSERT INTO courses (id, title, description, level, category_id, instructor_id, status, created_at) VALUES (7, 'Git and GitHub', 'Track your work with Git and share it on GitHub, a must-have skill for every developer.', 'beginner', 4, 2, 'published', '2026-10-03 05:00:00');
INSERT INTO courses (id, title, description, level, category_id, instructor_id, status, created_at) VALUES (8, 'Intro to Node.js', 'Run JavaScript on a server and build your first API with Express.', 'intermediate', 1, 3, 'pending', '2026-10-04 05:00:00');
INSERT INTO courses (id, title, description, level, category_id, instructor_id, status, created_at) VALUES (9, 'My Test Course', 'A short course made from the API test.', 'beginner', 1, 2, 'draft', '2026-11-16 09:41:15');

-- lessons (23 rows)
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (1, 1, 'What is HTML?', '<p>HTML is the language that gives a web page its structure. It uses tags such as h1, p and a to mark headings, paragraphs and links.</p><p>Every page starts with a doctype and wraps its content in html, head and body tags.</p>', NULL, 1, 8);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (2, 1, 'Styling with CSS', '<p>CSS controls how HTML looks: colours, fonts, spacing and layout. A rule has a selector and a block of properties, like p { color: maroon; }.</p><p>You can link one stylesheet from the head so many pages share the same design.</p>', NULL, 2, 10);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (3, 1, 'Layout with Flexbox', '<p>Flexbox lines items up in a row or a column. Set display: flex on the parent, then use justify-content and align-items to place the children.</p><p>It makes responsive layouts much easier than old float tricks.</p>', NULL, 3, 12);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (4, 2, 'Variables and data types', '<p>Variables store values. Use const for values that do not change and let for values that do.</p><p>Common types are string, number, boolean, array and object.</p>', NULL, 1, 10);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (5, 2, 'Functions', '<p>A function is a reusable block of code. You write it once and call it whenever you need it, with different inputs.</p><p>Arrow functions give a shorter way to write them.</p>', NULL, 2, 12);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (6, 2, 'Working with the DOM', '<p>The DOM is the page as JavaScript sees it. You can select an element, change its text and react to clicks with event listeners.</p><p>This is how buttons and forms become interactive.</p>', NULL, 3, 12);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (7, 3, 'Components and JSX', '<p>A React component is a function that returns JSX, which looks like HTML inside JavaScript. Components let you split a page into small reusable pieces.</p>', NULL, 1, 10);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (8, 3, 'State with useState', '<p>State is data that can change over time. The useState hook gives you the current value and a function to update it, and React redraws the component when it changes.</p>', NULL, 2, 12);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (9, 3, 'Effects and data fetching', '<p>useEffect runs code after the component appears or when a value changes. It is the usual place to fetch data from an API.</p>', NULL, 3, 12);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (10, 4, 'Your first Python program', '<p>Python is known for readable code. The print function shows text on the screen, so print(''Hello'') is a complete program.</p><p>Indentation, not curly braces, groups the lines of code together.</p>', NULL, 1, 8);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (11, 4, 'Lists and loops', '<p>A list holds many values in order. A for loop goes through them one by one so you can work with each item.</p>', NULL, 2, 10);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (12, 4, 'Functions in Python', '<p>Use the def keyword to define a function. It can take inputs, called parameters, and send back a result with return.</p>', NULL, 3, 10);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (13, 5, 'Tables, rows and columns', '<p>A relational database stores data in tables. Each row is one record and each column is one kind of information, like name or email.</p>', NULL, 1, 8);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (14, 5, 'Reading data with SELECT', '<p>SELECT chooses columns from a table, and WHERE filters the rows. For example, SELECT name FROM users WHERE role = ''admin'' returns only admin names.</p>', NULL, 2, 10);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (15, 5, 'Joining tables', '<p>A JOIN combines rows from two tables using a shared key, such as user_id. This lets you show a booking together with the name of the person who made it.</p>', NULL, 3, 12);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (16, 6, 'What is good UX?', '<p>User experience is how easy and pleasant a product is to use. Good UX removes confusion, so people reach their goal in as few steps as possible.</p>', NULL, 1, 8);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (17, 6, 'Colour and contrast', '<p>Text must stand out from its background so everyone can read it. A contrast ratio of at least 4.5 to 1 is the common rule for normal text.</p>', NULL, 2, 10);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (18, 6, 'Designing for mobile', '<p>Most visitors use a phone. Start with the small screen, keep tap targets large and let the layout grow for bigger screens.</p>', NULL, 3, 10);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (19, 7, 'What is Git?', '<p>Git is a version control tool. It saves snapshots of your project called commits, so you can see history and go back if something breaks.</p>', NULL, 1, 8);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (20, 7, 'Commit, push and pull', '<p>git add stages your changes, git commit saves them and git push sends them to GitHub. git pull brings the latest changes down to your computer.</p>', NULL, 2, 10);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (21, 7, 'Branches and pull requests', '<p>A branch is a safe copy where you try new work. When it is ready you open a pull request so others can review it before it joins main.</p>', NULL, 3, 12);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (22, 8, 'What is Node.js?', '<p>Node.js lets you run JavaScript outside the browser, on a server. It is popular for building APIs and tools.</p>', NULL, 1, 8);
INSERT INTO lessons (id, course_id, title, content, video_url, position, duration_min) VALUES (23, 8, 'Building a simple API with Express', '<p>Express is a small framework for Node.js. You define routes, such as GET /api/courses, and send back JSON.</p>', NULL, 2, 12);

-- enrollments (16 rows)
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (1, 5, 1, '2026-10-17 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (2, 5, 2, '2026-10-18 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (3, 5, 3, '2026-10-19 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (4, 6, 3, '2026-10-19 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (5, 6, 4, '2026-10-20 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (6, 6, 5, '2026-10-21 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (7, 7, 5, '2026-10-21 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (8, 7, 6, '2026-10-22 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (9, 7, 7, '2026-10-23 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (10, 8, 7, '2026-10-23 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (11, 8, 1, '2026-10-24 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (12, 8, 2, '2026-10-25 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (13, 9, 2, '2026-10-25 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (14, 9, 3, '2026-10-26 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (15, 9, 4, '2026-10-27 05:00:00');
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES (17, 1, 7, '2026-11-17 06:45:01');

-- lesson_progress (22 rows)
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (1, 5, 4, '2026-10-28 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (2, 5, 7, '2026-10-29 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (3, 5, 8, '2026-10-30 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (4, 6, 7, '2026-10-28 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (5, 6, 10, '2026-10-29 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (6, 6, 11, '2026-10-30 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (7, 6, 13, '2026-10-30 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (8, 6, 14, '2026-10-31 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (9, 6, 15, '2026-11-01 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (10, 7, 13, '2026-10-29 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (11, 7, 14, '2026-10-30 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (12, 7, 16, '2026-10-30 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (13, 7, 17, '2026-10-31 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (14, 7, 18, '2026-11-01 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (15, 8, 19, '2026-10-30 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (16, 8, 20, '2026-10-31 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (17, 8, 21, '2026-11-01 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (18, 8, 4, '2026-11-01 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (19, 9, 7, '2026-11-01 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (20, 9, 10, '2026-11-02 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (21, 9, 11, '2026-11-03 05:00:00');
INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (22, 5, 1, '2026-11-16 09:36:58');

-- quizzes (8 rows)
INSERT INTO quizzes (id, course_id, title, pass_percent) VALUES (1, 1, 'HTML and CSS Quiz', 60);
INSERT INTO quizzes (id, course_id, title, pass_percent) VALUES (2, 2, 'JavaScript Basics Quiz', 60);
INSERT INTO quizzes (id, course_id, title, pass_percent) VALUES (3, 3, 'React Quiz', 60);
INSERT INTO quizzes (id, course_id, title, pass_percent) VALUES (4, 4, 'Python Basics Quiz', 60);
INSERT INTO quizzes (id, course_id, title, pass_percent) VALUES (5, 5, 'SQL Quiz', 60);
INSERT INTO quizzes (id, course_id, title, pass_percent) VALUES (6, 6, 'UI/UX Quiz', 60);
INSERT INTO quizzes (id, course_id, title, pass_percent) VALUES (7, 7, 'Git Quiz', 60);
INSERT INTO quizzes (id, course_id, title, pass_percent) VALUES (8, 8, 'Node.js Quiz', 60);

-- questions (31 rows)
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (1, 1, 'Which tag creates the biggest heading?', 'h6', 'h1', 'head', 'header', 'b', 'h1 is the top level heading.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (2, 1, 'What does CSS stand for?', 'Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style System', 'b', 'CSS means Cascading Style Sheets.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (3, 1, 'Which property turns on Flexbox?', 'display: flex', 'position: flex', 'flex: display', 'layout: flex', 'a', 'Set display: flex on the parent element.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (4, 1, 'Which tag makes a link?', 'link', 'a', 'href', 'url', 'b', 'The a (anchor) tag makes links.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (5, 2, 'Which keyword declares a value that cannot be reassigned?', 'var', 'let', 'const', 'static', 'c', 'const creates a binding that cannot be reassigned.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (6, 2, 'What does a function do?', 'Stores a single value', 'Runs a reusable block of code', 'Styles a page', 'Creates a database', 'b', 'A function is a reusable block of code.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (7, 2, 'Which method selects an element by its id?', 'document.getElementById()', 'document.findId()', 'window.select()', 'page.getId()', 'a', 'getElementById finds one element by its id.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (8, 2, 'What is 2 + ''2'' in JavaScript?', '4', '22 (a string)', 'NaN', 'An error', 'b', 'The number is joined to the text, giving the string 22.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (9, 3, 'What does a React component return?', 'SQL', 'JSX', 'A database row', 'CSS only', 'b', 'Components return JSX.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (10, 3, 'Which hook stores changing data?', 'useEffect', 'useState', 'useRoute', 'useStyle', 'b', 'useState keeps data that changes.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (11, 3, 'Which hook is commonly used to fetch data?', 'useEffect', 'useFetchOnly', 'useData', 'useHTML', 'a', 'useEffect runs side effects such as fetching.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (12, 3, 'Why do we split a page into components?', 'To make it reusable and easier to maintain', 'To slow the page down', 'Because HTML requires it', 'To hide the code', 'a', 'Small components are reusable and easier to maintain.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (13, 4, 'Which function shows text on the screen?', 'echo()', 'print()', 'show()', 'write()', 'b', 'print() displays text.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (14, 4, 'What does Python use to group lines of code?', 'Curly braces', 'Indentation', 'Semicolons', 'Brackets only', 'b', 'Indentation groups code in Python.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (15, 4, 'Which keyword defines a function?', 'func', 'define', 'def', 'function', 'c', 'def starts a function definition.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (16, 4, 'Which structure holds many values in order?', 'A list', 'A tag', 'A style', 'A route', 'a', 'A list keeps values in order.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (17, 5, 'What does each row in a table represent?', 'One column', 'One record', 'One database', 'One index', 'b', 'A row is one record.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (18, 5, 'Which clause filters rows?', 'WHERE', 'ORDER', 'GROUP', 'LIMIT', 'a', 'WHERE filters rows.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (19, 5, 'Which keyword combines two tables?', 'MERGE', 'JOIN', 'LINK', 'STACK', 'b', 'JOIN combines rows using a shared key.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (20, 5, 'Which statement reads data?', 'INSERT', 'DELETE', 'SELECT', 'CREATE', 'c', 'SELECT reads data.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (21, 6, 'What is the main goal of good UX?', 'More colours', 'Helping people reach their goal easily', 'Longer pages', 'Fewer links to home', 'b', 'Good UX helps people reach their goal easily.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (22, 6, 'What is the common minimum contrast ratio for normal text?', '1.5 to 1', '2 to 1', '4.5 to 1', '20 to 1', 'c', '4.5 to 1 is the usual minimum.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (23, 6, 'What does mobile first design mean?', 'Design for the small screen first', 'Design only for phones', 'Skip desktop', 'Use only images', 'a', 'You start small and grow the layout.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (24, 6, 'Why should buttons be large on mobile?', 'They are easier to tap', 'They load faster', 'They use less code', 'They need no label', 'a', 'Large targets are easier to tap.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (25, 7, 'What is a commit?', 'A saved snapshot of your project', 'A new website', 'A bug', 'A folder', 'a', 'A commit is a saved snapshot.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (26, 7, 'Which command sends your commits to GitHub?', 'git pull', 'git push', 'git clone', 'git init', 'b', 'git push uploads commits.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (27, 7, 'What is a branch used for?', 'Trying new work safely', 'Deleting history', 'Hosting a site', 'Compressing files', 'a', 'Branches keep new work separate.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (28, 7, 'Which command downloads the latest changes?', 'git pull', 'git add', 'git branch', 'git status', 'a', 'git pull downloads the latest changes.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (29, 8, 'Where does Node.js run JavaScript?', 'On a server or computer, outside the browser', 'Only inside Chrome', 'Only on phones', 'Only in databases', 'a', 'Node.js runs JavaScript outside the browser.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (30, 8, 'What does Express help you build?', 'Web servers and APIs', 'Spreadsheets', 'Logos', 'Videos', 'a', 'Express builds web servers and APIs.');
INSERT INTO questions (id, quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (31, 8, 'What format do APIs commonly send back?', 'JSON', 'PDF only', 'MP3', 'BMP', 'a', 'JSON is the common API format.');

-- quiz_attempts (7 rows)
INSERT INTO quiz_attempts (id, quiz_id, user_id, score, total, percent, passed, taken_at) VALUES (1, 5, 6, 2, 4, 50, 0, '2026-11-07 05:00:00');
INSERT INTO quiz_attempts (id, quiz_id, user_id, score, total, percent, passed, taken_at) VALUES (2, 6, 7, 2, 4, 50, 0, '2026-11-08 05:00:00');
INSERT INTO quiz_attempts (id, quiz_id, user_id, score, total, percent, passed, taken_at) VALUES (3, 7, 8, 2, 4, 50, 0, '2026-11-09 05:00:00');
INSERT INTO quiz_attempts (id, quiz_id, user_id, score, total, percent, passed, taken_at) VALUES (4, 1, 5, 3, 4, 75, 1, '2026-11-16 09:37:48');
INSERT INTO quiz_attempts (id, quiz_id, user_id, score, total, percent, passed, taken_at) VALUES (5, 7, 1, 1, 4, 25, 0, '2026-11-19 10:35:40');
INSERT INTO quiz_attempts (id, quiz_id, user_id, score, total, percent, passed, taken_at) VALUES (6, 7, 1, 0, 4, 0, 0, '2026-11-19 10:37:35');
INSERT INTO quiz_attempts (id, quiz_id, user_id, score, total, percent, passed, taken_at) VALUES (7, 7, 1, 0, 4, 0, 0, '2026-11-19 10:37:57');

-- posts (16 rows)
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (1, '5 Tips to Learn Programming Faster', '5-tips-to-learn-programming-faster', 'Small daily habits beat long weekend sessions. Here are five that work.', '<p>Learning to code is a marathon, not a sprint. The people who improve fastest are not the smartest, they are the most consistent.</p><h2>1. Code a little every day</h2><p>Thirty minutes daily beats five hours once a week, because your brain needs time to remember.</p><h2>2. Build small projects</h2><p>After every new topic, build something tiny. A to-do list teaches more than ten videos.</p><h2>3. Read other people''s code</h2><p>Open source projects show you how real developers solve problems.</p>', 2, 4, 'published', '2026-10-07 05:00:00', '2026-10-07 07:00:00');
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (2, 'Why Every Developer Should Learn Git', 'why-every-developer-should-learn-git', 'Git saves your history, protects your work and is expected in every team.', '<p>Git is the tool that lets you save versions of your project and go back when something breaks.</p><h2>It protects your work</h2><p>Every commit is a checkpoint. If a change goes wrong, you can return to the last good state.</p><h2>It is how teams work</h2><p>Companies use Git and GitHub daily, so knowing it makes you ready for a real job.</p>', 2, 4, 'published', '2026-10-10 05:00:00', '2026-10-10 07:00:00');
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (3, 'HTML vs CSS vs JavaScript: What Does Each Do?', 'html-vs-css-vs-javascript-what-does-each-do', 'The three languages of the web, explained with a house analogy.', '<p>Think of a web page as a house.</p><p><strong>HTML</strong> is the structure: walls, doors and rooms. <strong>CSS</strong> is the paint and furniture. <strong>JavaScript</strong> is the electricity that makes things move and respond.</p><p>You need all three, and they are easier to learn in that order.</p>', 2, 1, 'published', '2026-10-13 05:00:00', '2026-10-13 07:00:00');
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (4, 'Understanding React State in Plain English', 'understanding-react-state-in-plain-english', 'State is just data that can change, and React redraws the page when it does.', '<p>Imagine a counter on a page. The number changes when you click. That number is state.</p><h2>Why not a normal variable?</h2><p>A normal variable can change, but React will not know. State tells React to update the screen.</p><p>Use the useState hook and call its setter function whenever the value should change.</p>', 3, 1, 'published', '2026-10-16 05:00:00', '2026-10-16 07:00:00');
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (5, 'Python or JavaScript: Which Should You Learn First?', 'python-or-javascript-which-should-you-learn-first', 'Both are great first languages. The right choice depends on your goal.', '<p>If you want to build websites, start with JavaScript. If you are interested in data, automation or AI, start with Python.</p><p>Python reads almost like English, which makes the first weeks easier. JavaScript runs in every browser, so you see results at once.</p><p>Either way, the ideas you learn carry over to the other.</p>', 3, 2, 'published', '2026-10-19 05:00:00', '2026-10-19 07:00:00');
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (6, 'A Beginner Guide to SQL Joins', 'a-beginner-guide-to-sql-joins', 'Joins connect tables. Here is the idea without the confusing diagrams.', '<p>Real data is split across tables. Users in one table, orders in another.</p><h2>What a join does</h2><p>A join matches rows using a shared column, like user_id, and shows them together.</p><p>Start with INNER JOIN, which keeps only the rows that match on both sides.</p>', 4, 2, 'published', '2026-10-22 05:00:00', '2026-10-22 07:00:00');
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (7, 'Colour Contrast: The Easiest Accessibility Win', 'colour-contrast-the-easiest-accessibility-win', 'One simple check makes your site readable for everyone.', '<p>Light grey text on a white background looks stylish, but many people cannot read it.</p><h2>The rule</h2><p>Normal text should have a contrast ratio of at least 4.5 to 1 against its background.</p><p>Free tools can check this in seconds, so there is no reason to skip it.</p>', 4, 3, 'published', '2026-10-25 05:00:00', '2026-10-25 07:00:00');
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (8, 'How to Build a Portfolio That Gets Noticed', 'how-to-build-a-portfolio-that-gets-noticed', 'Three to five finished projects with clear READMEs beat twenty half-done ones.', '<p>Recruiters spend under a minute on a portfolio. Make that minute count.</p><h2>Quality over quantity</h2><p>Show a few complete projects. Each should have a live demo or screenshots, a clear README and clean code.</p><h2>Tell the story</h2><p>Explain what problem you solved and what you learned.</p>', 2, 4, 'published', '2026-10-28 05:00:00', '2026-10-28 07:00:00');
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (9, 'Mobile First: Designing for Small Screens', 'mobile-first-designing-for-small-screens', 'Start with the phone and the desktop layout becomes easy.', '<p>Most visitors browse on a phone, so design for that screen first.</p><p>Keep one column, make buttons large and keep text readable. Then add extra columns as the screen gets wider with CSS media queries.</p>', 4, 3, 'published', '2026-10-31 05:00:00', '2026-10-31 07:00:00');
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (10, 'Common Mistakes New Developers Make', 'common-mistakes-new-developers-make', 'Everyone makes these mistakes. Knowing them early saves weeks.', '<p>Copying code without understanding it is the biggest one. If you cannot explain a line, you do not own it yet.</p><p>Other common mistakes: skipping error messages, never committing to Git and trying to learn five languages at once.</p>', 3, 4, 'published', '2026-11-03 05:00:00', '2026-11-03 07:00:00');
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (11, 'What I Learned Building My First API', 'what-i-learned-building-my-first-api', 'Routes, JSON and error handling: my notes from the first week.', '<p>An API is a menu of URLs that other programs can call.</p><p>My biggest lesson was to return clear error messages, so the person using the API knows what went wrong.</p>', 3, 1, 'pending', '2026-11-06 05:00:00', NULL);
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (12, 'Dark Mode Done Right', 'dark-mode-done-right', 'Dark mode is not just inverted colours. Here is how to do it well.', '<p>Pure black with pure white text is harsh on the eyes. Use a very dark brown or blue and a soft off-white instead.</p><p>Keep contrast high enough to read, and test your colours in a dim room.</p>', 4, 3, 'pending', '2026-11-09 05:00:00', NULL);
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (13, 'My first post from the API', 'my-first-post-from-the-api', 'Hello world, this is a test post with enough text.', '<p>Hello world, this is a test post with enough text.</p>', 2, 1, 'published', '2026-11-16 09:43:12', '2026-11-16 09:43:12');
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (14, 'My first post from the API', 'my-first-post-from-the-api-2', 'Hello world, this is a test post with enough text.', '<p>Hello world, this is a test post with enough text.</p>', 2, 1, 'pending', '2026-11-17 06:07:59', NULL);
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (15, 'My first post from the API', 'my-first-post-from-the-api-3', 'Hello world, this is a test post with enough text.', '<p>Hello world, this is a test post with enough text.</p>', 2, 1, 'pending', '2026-11-17 06:08:39', NULL);
INSERT INTO posts (id, title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (16, 'Safety check post', 'safety-check-post', 'This post has enough text to be valid.Second paragraph.', '<p>This post has enough text to be valid.</p><p>Second paragraph.</p>', 2, 1, 'published', '2026-11-17 06:09:09', '2026-11-17 06:09:09');

-- tags (22 rows)
INSERT INTO tags (id, name) VALUES (1, 'learning');
INSERT INTO tags (id, name) VALUES (2, 'beginners');
INSERT INTO tags (id, name) VALUES (3, 'productivity');
INSERT INTO tags (id, name) VALUES (4, 'git');
INSERT INTO tags (id, name) VALUES (5, 'github');
INSERT INTO tags (id, name) VALUES (6, 'tools');
INSERT INTO tags (id, name) VALUES (7, 'html');
INSERT INTO tags (id, name) VALUES (8, 'css');
INSERT INTO tags (id, name) VALUES (9, 'javascript');
INSERT INTO tags (id, name) VALUES (11, 'react');
INSERT INTO tags (id, name) VALUES (13, 'python');
INSERT INTO tags (id, name) VALUES (16, 'sql');
INSERT INTO tags (id, name) VALUES (17, 'databases');
INSERT INTO tags (id, name) VALUES (18, 'design');
INSERT INTO tags (id, name) VALUES (19, 'accessibility');
INSERT INTO tags (id, name) VALUES (21, 'portfolio');
INSERT INTO tags (id, name) VALUES (22, 'career');
INSERT INTO tags (id, name) VALUES (25, 'responsive');
INSERT INTO tags (id, name) VALUES (29, 'tips');
INSERT INTO tags (id, name) VALUES (30, 'nodejs');
INSERT INTO tags (id, name) VALUES (31, 'api');
INSERT INTO tags (id, name) VALUES (35, 'test');

-- post_tags (41 rows)
INSERT INTO post_tags (post_id, tag_id) VALUES (1, 1);
INSERT INTO post_tags (post_id, tag_id) VALUES (1, 2);
INSERT INTO post_tags (post_id, tag_id) VALUES (1, 3);
INSERT INTO post_tags (post_id, tag_id) VALUES (2, 4);
INSERT INTO post_tags (post_id, tag_id) VALUES (2, 5);
INSERT INTO post_tags (post_id, tag_id) VALUES (2, 6);
INSERT INTO post_tags (post_id, tag_id) VALUES (3, 7);
INSERT INTO post_tags (post_id, tag_id) VALUES (3, 8);
INSERT INTO post_tags (post_id, tag_id) VALUES (3, 9);
INSERT INTO post_tags (post_id, tag_id) VALUES (3, 2);
INSERT INTO post_tags (post_id, tag_id) VALUES (4, 11);
INSERT INTO post_tags (post_id, tag_id) VALUES (4, 9);
INSERT INTO post_tags (post_id, tag_id) VALUES (5, 13);
INSERT INTO post_tags (post_id, tag_id) VALUES (5, 9);
INSERT INTO post_tags (post_id, tag_id) VALUES (5, 2);
INSERT INTO post_tags (post_id, tag_id) VALUES (6, 16);
INSERT INTO post_tags (post_id, tag_id) VALUES (6, 17);
INSERT INTO post_tags (post_id, tag_id) VALUES (7, 18);
INSERT INTO post_tags (post_id, tag_id) VALUES (7, 19);
INSERT INTO post_tags (post_id, tag_id) VALUES (7, 8);
INSERT INTO post_tags (post_id, tag_id) VALUES (8, 21);
INSERT INTO post_tags (post_id, tag_id) VALUES (8, 22);
INSERT INTO post_tags (post_id, tag_id) VALUES (8, 5);
INSERT INTO post_tags (post_id, tag_id) VALUES (9, 18);
INSERT INTO post_tags (post_id, tag_id) VALUES (9, 25);
INSERT INTO post_tags (post_id, tag_id) VALUES (9, 8);
INSERT INTO post_tags (post_id, tag_id) VALUES (10, 2);
INSERT INTO post_tags (post_id, tag_id) VALUES (10, 1);
INSERT INTO post_tags (post_id, tag_id) VALUES (10, 29);
INSERT INTO post_tags (post_id, tag_id) VALUES (11, 30);
INSERT INTO post_tags (post_id, tag_id) VALUES (11, 31);
INSERT INTO post_tags (post_id, tag_id) VALUES (11, 2);
INSERT INTO post_tags (post_id, tag_id) VALUES (12, 18);
INSERT INTO post_tags (post_id, tag_id) VALUES (12, 8);
INSERT INTO post_tags (post_id, tag_id) VALUES (13, 35);
INSERT INTO post_tags (post_id, tag_id) VALUES (13, 31);
INSERT INTO post_tags (post_id, tag_id) VALUES (14, 35);
INSERT INTO post_tags (post_id, tag_id) VALUES (14, 31);
INSERT INTO post_tags (post_id, tag_id) VALUES (15, 35);
INSERT INTO post_tags (post_id, tag_id) VALUES (15, 31);
INSERT INTO post_tags (post_id, tag_id) VALUES (16, 35);

-- comments (17 rows)
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (1, 1, 5, 'Really clear explanation, thank you!', 'approved', '2026-10-12 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (2, 2, 6, 'Great article. Can you write one about APIs next?', 'approved', '2026-10-15 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (3, 2, 7, 'I tried this and it worked on the first go.', 'approved', '2026-10-16 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (4, 3, 7, 'Short and useful. Bookmarking this one.', 'approved', '2026-10-18 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (5, 4, 8, 'Good tips, especially the part about small projects.', 'approved', '2026-10-21 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (6, 4, 9, 'Simple and easy to follow. Thanks!', 'approved', '2026-10-22 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (7, 5, 9, 'Really clear explanation, thank you!', 'approved', '2026-10-24 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (8, 6, 5, 'Great article. Can you write one about APIs next?', 'approved', '2026-10-27 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (9, 6, 6, 'I tried this and it worked on the first go.', 'approved', '2026-10-28 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (10, 7, 6, 'Short and useful. Bookmarking this one.', 'approved', '2026-10-30 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (11, 8, 7, 'Good tips, especially the part about small projects.', 'approved', '2026-11-02 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (12, 8, 8, 'Simple and easy to follow. Thanks!', 'approved', '2026-11-03 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (13, 9, 8, 'Really clear explanation, thank you!', 'approved', '2026-11-05 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (14, 10, 9, 'Great article. Can you write one about APIs next?', 'approved', '2026-11-08 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (15, 10, 5, 'I tried this and it worked on the first go.', 'approved', '2026-11-09 10:00:00');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (16, 1, 5, 'Nice article!', 'approved', '2026-11-16 09:43:12');
INSERT INTO comments (id, post_id, user_id, body, status, created_at) VALUES (17, 1, 5, 'Nice article!', 'approved', '2026-11-17 06:07:59');

COMMIT;
PRAGMA foreign_keys = ON;
