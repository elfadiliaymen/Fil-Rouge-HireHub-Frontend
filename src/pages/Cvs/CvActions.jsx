import { Link } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import FileUploadIcon from "@mui/icons-material/FileUpload";

export default function CvActions() {
  return (
    <div className="actions-page">
      <div className="page-head">
        <div>
          <h1>Gestion des CV</h1>
          <p className="text-muted">Choisissez une opération.</p>
        </div>
      </div>

      <div className="actions-grid">
        <Link to="/cvs" className="action-card">
          <DescriptionIcon className="action-card-icon" />
          <h2>Mes CV</h2>
          <p>Consulter et supprimer vos CV.</p>
        </Link>

        <Link to="/add-cv" className="action-card">
          <FileUploadIcon className="action-card-icon" />
          <h2>Déposer un CV</h2>
          <p>Importer un nouveau document PDF.</p>
        </Link>
      </div>
    </div>
  );
}