module.exports = [
  {
    title: "HTML and CSS Basics",
    level: "beginner",
    category: "Web Development",
    instructor: 0,
    status: "published",
    description: "Build your first web page from scratch. Learn tags, styling and modern layouts.",
    lessons: [
      ["What is HTML?", "<p>HTML is the language that gives a web page its structure. It uses tags such as h1, p and a to mark headings, paragraphs and links.</p><p>Every page starts with a doctype and wraps its content in html, head and body tags.</p>", 8],
      ["Styling with CSS", "<p>CSS controls how HTML looks: colours, fonts, spacing and layout. A rule has a selector and a block of properties, like p { color: maroon; }.</p><p>You can link one stylesheet from the head so many pages share the same design.</p>", 10],
      ["Layout with Flexbox", "<p>Flexbox lines items up in a row or a column. Set display: flex on the parent, then use justify-content and align-items to place the children.</p><p>It makes responsive layouts much easier than old float tricks.</p>", 12],
    ],
    quiz: {
      title: "HTML and CSS Quiz",
      pass: 60,
      questions: [
        ["Which tag creates the biggest heading?", "h6", "h1", "head", "header", "b", "h1 is the top level heading."],
        ["What does CSS stand for?", "Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style System", "b", "CSS means Cascading Style Sheets."],
        ["Which property turns on Flexbox?", "display: flex", "position: flex", "flex: display", "layout: flex", "a", "Set display: flex on the parent element."],
        ["Which tag makes a link?", "link", "a", "href", "url", "b", "The a (anchor) tag makes links."],
      ],
    },
  },
  {
    title: "JavaScript for Beginners",
    level: "beginner",
    category: "Web Development",
    instructor: 0,
    status: "published",
    description: "Learn the core ideas of JavaScript: variables, functions and how to make pages interactive.",
    lessons: [
      ["Variables and data types", "<p>Variables store values. Use const for values that do not change and let for values that do.</p><p>Common types are string, number, boolean, array and object.</p>", 10],
      ["Functions", "<p>A function is a reusable block of code. You write it once and call it whenever you need it, with different inputs.</p><p>Arrow functions give a shorter way to write them.</p>", 12],
      ["Working with the DOM", "<p>The DOM is the page as JavaScript sees it. You can select an element, change its text and react to clicks with event listeners.</p><p>This is how buttons and forms become interactive.</p>", 12],
    ],
    quiz: {
      title: "JavaScript Basics Quiz",
      pass: 60,
      questions: [
        ["Which keyword declares a value that cannot be reassigned?", "var", "let", "const", "static", "c", "const creates a binding that cannot be reassigned."],
        ["What does a function do?", "Stores a single value", "Runs a reusable block of code", "Styles a page", "Creates a database", "b", "A function is a reusable block of code."],
        ["Which method selects an element by its id?", "document.getElementById()", "document.findId()", "window.select()", "page.getId()", "a", "getElementById finds one element by its id."],
        ["What is 2 + '2' in JavaScript?", "4", "22 (a string)", "NaN", "An error", "b", "The number is joined to the text, giving the string 22."],
      ],
    },
  },
  {
    title: "React Fundamentals",
    level: "intermediate",
    category: "Web Development",
    instructor: 1,
    status: "published",
    description: "Understand components, state and effects, the three ideas behind every React app.",
    lessons: [
      ["Components and JSX", "<p>A React component is a function that returns JSX, which looks like HTML inside JavaScript. Components let you split a page into small reusable pieces.</p>", 10],
      ["State with useState", "<p>State is data that can change over time. The useState hook gives you the current value and a function to update it, and React redraws the component when it changes.</p>", 12],
      ["Effects and data fetching", "<p>useEffect runs code after the component appears or when a value changes. It is the usual place to fetch data from an API.</p>", 12],
    ],
    quiz: {
      title: "React Quiz",
      pass: 60,
      questions: [
        ["What does a React component return?", "SQL", "JSX", "A database row", "CSS only", "b", "Components return JSX."],
        ["Which hook stores changing data?", "useEffect", "useState", "useRoute", "useStyle", "b", "useState keeps data that changes."],
        ["Which hook is commonly used to fetch data?", "useEffect", "useFetchOnly", "useData", "useHTML", "a", "useEffect runs side effects such as fetching."],
        ["Why do we split a page into components?", "To make it reusable and easier to maintain", "To slow the page down", "Because HTML requires it", "To hide the code", "a", "Small components are reusable and easier to maintain."],
      ],
    },
  },
];
