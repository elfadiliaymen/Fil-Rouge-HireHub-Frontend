import { Link } from "react-router-dom";

function UserActions() {
  return (
    <div className="page">
      <h1>Gestion des Utilisateurs</h1>

      <div className="cards-actions">
        <Link className="action-card" to="/users">
          <h2>Liste des Utilisateurs</h2>
          <p>Afficher tous les utilisateurs.</p>
        </Link>

        <Link className="action-card" to="/add-user">
          <h2>Ajouter un Utilisateur</h2>
          <p>Créer un nouvel utilisateur.</p>
        </Link>
      </div>
    </div>
  );
}

export default UserActions;