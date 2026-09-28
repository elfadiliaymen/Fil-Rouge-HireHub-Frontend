import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import api from "../api/api";
import { clearSession } from "./token";
import { userInitials } from "../utils/format";

export default function Header({ user, onToggleMenu }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocumentClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  function handleLogout() {
    api
      .post("/auth/logout")
      .catch(function () {})
      .finally(function () {
        clearSession();
        navigate("/");
      });
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="icon-button"
          aria-label="Ouvrir ou fermer le menu"
          aria-expanded="false"
          onClick={onToggleMenu}
        >
          <MenuIcon />
        </button>
        <Link to="/dashboard" className="logo">
          Hire<span>Hub</span>
        </Link>
      </div>

      {user && (
        <div className="avatar-menu" ref={menuRef}>
          <button
            type="button"
            className="avatar-button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="avatar">{userInitials(user)}</span>
            <span className="avatar-name">
              {user.prenom ? `${user.prenom} ${user.nom}` : user.email}
            </span>
          </button>

          {menuOpen && (
            <div className="dropdown" role="menu" aria-label="Menu du compte">
              <Link
                to="/profile"
                role="menuitem"
                className="dropdown-item"
                onClick={() => setMenuOpen(false)}
              >
                Mon profil
              </Link>
              <div className="dropdown-sep" />
              <button
                type="button"
                role="menuitem"
                className="dropdown-item"
                onClick={handleLogout}
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
