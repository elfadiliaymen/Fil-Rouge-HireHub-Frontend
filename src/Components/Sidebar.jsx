import { NavLink } from "react-router-dom";

function Sidebar({ open }) {
  return (
    <aside className={"sidebar" + (open ? " open" : "")}>
      <nav className="sidebar-nav">
        <NavLink to="/users-actions" className="sidebar-link">
          Utilisateurs
        </NavLink>

        <NavLink to="/cvs-actions" className="sidebar-link">
          CV
        </NavLink>

        <NavLink to="/candidatures-actions" className="sidebar-link">
          Candidatures
        </NavLink>

        <NavLink to="/offres-actions" className="sidebar-link">
          Offres d'Emploi
        </NavLink>

        <NavLink to="/entretiens-actions" className="sidebar-link">
          Entretiens
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;