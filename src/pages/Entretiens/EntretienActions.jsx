import { Link } from "react-router-dom";

function EntretienActions() {
  return (
    <div className="page">
      <h1>Gestion des Entretiens</h1>

      <div className="cards-actions">
        <Link className="action-card" to="/entretiens">
          <h2>Liste des Entretiens</h2>
          <p>Afficher tous les entretiens.</p>
        </Link>

        <Link className="action-card" to="/add-entretien">
          <h2>Planifier un Entretien</h2>
          <p>Créer un nouvel entretien.</p>
        </Link>
      </div>
    </div>
  );
}

export default EntretienActions;