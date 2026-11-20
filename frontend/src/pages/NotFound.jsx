import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container page rise" style={{ textAlign: "center", paddingTop: 90 }}>
      <Compass size={56} style={{ color: "#7c5cdb" }} />
      <h1 style={{ marginTop: 16 }}>Page not found</h1>
      <p className="muted lead" style={{ margin: "0 auto 24px" }}>The page you are looking for has moved or never existed.</p>
      <div className="row" style={{ justifyContent: "center" }}>
        <Link to="/" className="btn">Go home</Link>
        <Link to="/courses" className="btn ghost">Browse courses</Link>
      </div>
    </div>
  );
}
