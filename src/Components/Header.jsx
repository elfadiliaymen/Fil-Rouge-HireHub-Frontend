import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import api from "../api/api";
import { clearSession } from "./token";
import "./Header.css";

function userInitials(user) {
  if (!user) return "?";

  const prenom = (user.prenom || "").trim();
  const nom = (user.nom || "").trim();

  if (prenom && nom) {
    return (prenom[0] + nom[0]).toUpperCase();
  }

  return ((user.email || nom || "?").trim()[0] || "?").toUpperCase();
}

export default function Header({ user, onToggleMenu }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
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

  function handleSearch(event) {
    event.preventDefault();
    navigate("/jobs?search=" + encodeURIComponent(search.trim()));
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

      <form className="header-search" role="search" onSubmit={handleSearch}>
        <SearchIcon className="header-search-icon" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une offre…"
          aria-label="Rechercher une offre"
        />
      </form>

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