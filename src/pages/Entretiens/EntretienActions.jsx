import { Link } from "react-router-dom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AddBoxIcon from "@mui/icons-material/AddBox";

export default function EntretienActions() {
  return (
    <div className="actions-page">
      <div className="page-head">
        <div>
          <h1>Gestion des entretiens</h1>
          <p className="text-muted">Choisissez une opération.</p>
        </div>
      </div>

      <div className="actions-grid">
        <Link to="/entretiens" className="action-card">
          <EventNoteIcon className="action-card-icon" />
          <h2>Liste des entretiens</h2>
          <p>Afficher tous les entretiens planifiés.</p>
        </Link>

        <Link to="/add-entretien" className="action-card">
          <AddBoxIcon className="action-card-icon" />
          <h2>Planifier un entretien</h2>
          <p>Organiser un entretien pour une candidature.</p>
        </Link>
      </div>
    </div>
  );
}