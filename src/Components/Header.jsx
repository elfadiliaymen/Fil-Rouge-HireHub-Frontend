import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="logo">
        <h1>HireHub</h1>
        <span>Job Management System</span>
      </div>

      <nav className="header-nav">
        <Link to="/">Accueil</Link>
        <button className="btn-primary" onClick={logout}>Déconnexion</button>
      </nav>
    </header>
  );
}

export default Header;