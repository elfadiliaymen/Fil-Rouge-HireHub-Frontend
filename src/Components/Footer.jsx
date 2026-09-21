import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer({ variant = "app" }) {
  return (
    <footer className="footer">
      <div
        className={
          "footer-inner" + (variant === "public" ? " footer-inner-public container" : "")
        }
      >
        <Link to="/" className="logo">
          HireHub
        </Link>

        {variant === "public" && (
          <nav className="footer-links" aria-label="Liens du pied de page">
            <Link to="/jobs">Offres</Link>
            <Link to="/auth">Connexion</Link>
            <Link to="/auth?mode=register">Inscription</Link>
          </nav>
        )}

        <p className="footer-note">Plateforme de gestion du recrutement. Projet de formation.</p>
      </div>
    </footer>
  );
}