import { Link } from "react-router-dom";
import "./AccessDenied.css";

export default function NotFound() {
  return (
    <div className="system-page">
      <h2>The code 404</h2>
      <p>La page que vous recherchez n'existe pas.</p>
      <p className="system-page-sub">
        Elle a peut-être été déplacée ou supprimée.
      </p>
      <Link to="/">Accueil</Link>
    </div>
  );
}