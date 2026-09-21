import { Link } from "react-router-dom";
import "./AccessDenied.css";

export default function AccessDenied() {
  return (
    <div className="system-page">
      <h2>The code 403</h2>
      <p>Vous n'avez pas accès à cette page.</p>
      <p className="system-page-sub">
        Votre rôle ne vous permet pas de consulter cette ressource.
      </p>
      <Link to="/dashboard">Tableau de bord</Link>
    </div>
  );
}