import { Link } from "react-router-dom";

function CandidatureActions() {
  return (
    <div className="page">
      <h1>Gestion des Candidatures</h1>

      <div className="cards-actions">
        <Link className="action-card" to="/candidatures">
          <h2>Liste des Candidatures</h2>
          <p>Afficher toutes les candidatures.</p>
        </Link>

        <Link className="action-card" to="/add-candidature">
          <h2>Ajouter une Candidature</h2>
          <p>Créer une nouvelle candidature.</p>
        </Link>
      </div>
    </div>
  );
}

export default CandidatureActions;