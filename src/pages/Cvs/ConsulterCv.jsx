import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { formatDate } from "../../utils/format";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import Button from "../../Components/ui/Button";
import "./Cvs.css";

export default function ConsulterCv() {
  const { cvId } = useParams();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [cv, setCv] = useState(null);

  function load() {
    setStatus("loading");
    setError("");

    api
      .get("/cv/" + cvId)
      .then(function (response) {
        setCv(response.data);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, [cvId]);

  function handleDownload() {
    api
      .get("/cv/download/" + cv.id, { responseType: "blob" })
      .then(function (response) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = cv.nomFichier || "cv.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "Le téléchargement a échoué."));
      });
  }

  if (status === "loading") {
    return <Skeleton lines={4} />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <div className="consulter-cv-page">
      <div className="page-head">
        <div>
          <h1>Détail du CV</h1>
          <p className="text-muted">Informations du fichier déposé.</p>
        </div>
        <Link to="/cvs" className="btn btn-secondary">
          <ArrowBackIcon /> Mes CV
        </Link>
      </div>

      <div className="detail-card">
        <dl className="detail-grid">
          <div className="detail-field">
            <dt>Nom du fichier</dt>
            <dd>{cv.nomFichier}</dd>
          </div>
          <div className="detail-field">
            <dt>Date de dépôt</dt>
            <dd>{formatDate(cv.dateUpload)}</dd>
          </div>
          <div className="detail-field">
            <dt>Candidat</dt>
            <dd>
              {cv.candidat?.prenom} {cv.candidat?.nom}
            </dd>
          </div>
        </dl>

        <div className="form-actions">
          <Button onClick={handleDownload}>Télécharger</Button>
          <Link to={`/update-cv/${cv.id}`} className="btn btn-secondary">
            Remplacer
          </Link>
        </div>
      </div>
    </div>
  );
}