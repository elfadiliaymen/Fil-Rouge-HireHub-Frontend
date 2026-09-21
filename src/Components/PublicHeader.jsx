import { Link } from "react-router-dom";
import { getRole, isAuthenticated } from "./token";
import { getLandingRoute } from "../config/roles";
import "./PublicHeader.css";

export default function PublicHeader() {
  return (
    <header className="public-header">
      <div className="public-header-inner container">
        <Link to="/" className="logo">
          Hire<span>Hub</span>
        </Link>

        <nav className="public-nav" aria-label="Navigation principale">
          {isAuthenticated() ? (
            <Link to={getLandingRoute(getRole())} className="btn btn-primary">
              Accéder à mon espace
            </Link>
          ) : (
            <>
              <Link to="/auth" className="btn btn-secondary">
                Se connecter
              </Link>
              <Link to="/auth?mode=register" className="btn btn-primary">
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}