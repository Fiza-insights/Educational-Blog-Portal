import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import MyLearning from "./pages/MyLearning.jsx";
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
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/blog" element={<Soon name="Blog" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="*" element={<Soon name="Page not found" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}



