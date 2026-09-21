import { Link } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { getRole } from "../../Components/token";

export default function CandidatureActions() {
  const isAdmin = getRole() === "ADMIN";

  return (
    <div className="actions-page">
      <div className="page-head">
        <div>
          <h1>Gestion des candidatures</h1>
          <p className="text-muted">Choisissez une opération.</p>
        </div>
      </div>

      <div className="actions-grid">
        <Link to="/candidatures" className="action-card">
          <AssignmentIcon className="action-card-icon" />
          <h2>Liste des candidatures</h2>
          <p>Afficher et traiter les candidatures reçues.</p>
        </Link>

        {isAdmin && (
          <Link to="/add-candidature" className="action-card">
            <AddBoxIcon className="action-card-icon" />
            <h2>Nouvelle candidature</h2>
            <p>Saisir manuellement une candidature.</p>
          </Link>
        )}
      </div>
    </div>
  );
}