import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { useReveal } from "./reveal.js";
import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import MyLearning from "./pages/MyLearning.jsx";
import Lesson from "./pages/Lesson.jsx";
import Quiz from "./pages/Quiz.jsx";
import Blog from "./pages/Blog.jsx";
import Post from "./pages/Post.jsx";
import Instructor from "./pages/Instructor.jsx";
import InstructorCourse from "./pages/InstructorCourse.jsx";
import Write from "./pages/Write.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function Soon({ name }) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2>{name}</h2>
      <p className="muted">Coming soon.</p>
    </div>
  );
}

export default function App() {
  const loc = useLocation();
  useReveal();
  return (
    <>
      <Navbar />
      <main>
        <div key={loc.pathname} className="pagefade">
          <Routes location={loc}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route path="/lesson/:id" element={<Lesson />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/instructor" element={<Instructor />} />
            <Route path="/instructor/:id" element={<InstructorCourse />} />
            <Route path="/write" element={<Write />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Soon name="Page not found" />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  );
}



