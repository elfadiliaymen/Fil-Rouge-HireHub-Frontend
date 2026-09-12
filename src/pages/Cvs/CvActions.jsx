import { Link } from "react-router-dom";

function CvActions() {
  return (
    <div className="page">
      <h1>Gestion des CV</h1>

      <div className="cards-actions">
        <Link className="action-card" to="/cvs">
          <h2>Liste des CV</h2>
          <p>Afficher tous les CV.</p>
        </Link>

        <Link className="action-card" to="/add-cv">
          <h2>Ajouter un CV</h2>
          <p>Créer un nouveau CV.</p>
        </Link>
      </div>
    </div>
  );
}

export default CvActions;