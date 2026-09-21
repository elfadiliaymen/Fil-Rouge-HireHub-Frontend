import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { formatDate } from "../../utils/format";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import EmptyState from "../../Components/ui/EmptyState";
import ConfirmDialog from "../../Components/ui/ConfirmDialog";
import Button from "../../Components/ui/Button";
import "./Cvs.css";

function downloadCv(cvId, nomFichier) {
  return api
    .get("/cv/download/" + cvId, { responseType: "blob" })
    .then(function (response) {
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = nomFichier || "cv.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
}

export default function CvsList() {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [cvs, setCvs] = useState([]);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setStatus("loading");
    setError("");

    api
      .get("/cv", { params: { page: 0, size: 50 } })
      .then(function (response) {
        setCvs(response.data.content || []);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, []);

  function handleDownload(cv) {
    downloadCv(cv.id, cv.nomFichier).catch(function (reason) {
      toast.error(getApiErrorMessage(reason, "Le téléchargement a échoué."));
    });
  }

  function handleDelete() {
    if (!toDelete) return;

    setDeleting(true);
    api
      .delete("/cv/" + toDelete.id)
      .then(function () {
        setCvs((current) => current.filter((cv) => cv.id !== toDelete.id));
        toast.success("CV supprimé");
        setToDelete(null);
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La suppression a échoué."));
      })
      .finally(function () {
        setDeleting(false);
      });
  }

  return (
    <div className="cvs-page">
      <div className="page-head">
        <div>
          <h1>Mon CV</h1>
          <p className="text-muted">
            Déposez, remplacez ou supprimez le fichier PDF de votre CV.
          </p>
        </div>

        <Link to="/add-cv" className="btn btn-primary">
          <AddIcon /> Déposer un CV
        </Link>
      </div>

      {status === "loading" && <Skeleton lines={4} />}

      {status === "error" && <ErrorState message={error} onRetry={load} />}

      {status === "success" && cvs.length === 0 && (
        <EmptyState
          title="Aucun CV déposé"
          message="Déposez vos CV en PDF (5 Mo maximum) pour postuler aux offres."
          action={
            <Link to="/add-cv" className="btn btn-primary">
              Déposer mon CV
            </Link>
          }
        />
      )}

      {status === "success" && cvs.length > 0 && (
        <div className="cv-list">
          {cvs.map((cv) => (
            <div key={cv.id} className="cv-card">
              <div className="cv-card-info">
                <strong>{cv.nomFichier}</strong>
                <span className="text-muted text-sm">
                  Déposé le {formatDate(cv.dateUpload)}
                </span>
              </div>

              <div className="cv-card-actions">
                <Button
                  variant="secondary"
                  className="btn-icon"
                  title="Télécharger"
                  aria-label="Télécharger le CV"
                  onClick={() => handleDownload(cv)}
                >
                  <DownloadIcon />
                </Button>
                <Link
                  to={`/consulter-cv/${cv.id}`}
                  className="btn btn-secondary btn-sm btn-icon"
                  title="Consulter"
                  aria-label="Consulter le CV"
                >
                  <VisibilityIcon />
                </Link>
                <Link
                  to={`/update-cv/${cv.id}`}
                  className="btn btn-secondary btn-sm btn-icon"
                  title="Remplacer"
                  aria-label="Remplacer le CV"
                >
                  <UploadFileIcon />
                </Link>
                <Button
                  variant="danger-solid"
                  className="btn-icon"
                  title="Supprimer"
                  aria-label="Supprimer le CV"
                  onClick={() => setToDelete(cv)}
                >
                  <DeleteIcon />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer le CV"
        message={`Voulez-vous vraiment supprimer « ${toDelete?.nomFichier || ""} » ?`}
        confirmLabel="Supprimer"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}