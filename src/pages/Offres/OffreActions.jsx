import { Link } from "react-router-dom";

function OffreActions() {
  return (
    <div className="page">
      <h1>Gestion des Offres d'Emploi</h1>

      <div className="cards-actions">
        <Link className="action-card" to="/offres">
          <h2>Liste des Offres</h2>
          <p>Afficher toutes les offres.</p>
        </Link>

        <Link className="action-card" to="/add-offre">
          <h2>Ajouter une Offre</h2>
          <p>Créer une nouvelle offre.</p>
        </Link>
      </div>
    </div>
  );
}

export default OffreActions;