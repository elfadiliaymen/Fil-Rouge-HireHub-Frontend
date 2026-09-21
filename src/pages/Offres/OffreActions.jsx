import { Link } from "react-router-dom";
import WorkIcon from "@mui/icons-material/Work";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { getRole } from "../../Components/token";

export default function OffreActions() {
  const isManagement = getRole() === "ADMIN" || getRole() === "RECRUTEUR";

  return (
    <div className="actions-page">
      <div className="page-head">
        <div>
          <h1>Gestion des offres</h1>
          <p className="text-muted">Choisissez une opération.</p>
        </div>
      </div>

      <div className="actions-grid">
        <Link to="/offres" className="action-card">
          <WorkIcon className="action-card-icon" />
          <h2>Liste des offres</h2>
          <p>Afficher les offres et leurs candidatures.</p>
        </Link>

        {isManagement && (
          <Link to="/add-offre" className="action-card">
            <AddBoxIcon className="action-card-icon" />
            <h2>Nouvelle offre</h2>
            <p>Publier un poste à pourvoir.</p>
          </Link>
        )}
      </div>
    </div>
  );
}