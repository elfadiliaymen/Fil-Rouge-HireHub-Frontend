import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getRole } from "../../component/token";
import { STATUT_VALUES, STATUT_LABELS } from "../../utils/constants";
import { formatDate } from "../../utils/format";
import { downloadCv } from "../../utils/download";
import StatusPill from "../../component/ui/StatusPill";
import Select from "../../component/ui/Select";
import Skeleton from "../../component/ui/Skeleton";
import ErrorState from "../../component/ui/ErrorState";
import EmptyState from "../../component/ui/EmptyState";
import Pagination from "../../component/ui/Pagination";
import ConfirmDialog from "../../component/ui/ConfirmDialog";
import Button from "../../component/ui/Button";

export default function CandidaturesList() {
  const role = getRole();
  const isCandidat = role === "CANDIDAT";
  const isManagement = role === "ADMIN" || role === "RECRUTEUR";

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [candidatures, setCandidatures] = useState([]);
  const [statut, setStatut] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setStatus("loading");
    setError("");

    api
      .get("/candidatures", { params: { page: 0, size: 50 } })
      .then(function (response) {
        setCandidatures(response.data.content || []);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, []);

  const filtered = statut
    ? candidatures.filter((candidature) => candidature.statut === statut)
    : candidatures;

  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(currentPage * size, currentPage * size + size);

  function handleDelete() {
    if (!toDelete) return;

    setDeleting(true);
    api
      .delete("/candidatures/" + toDelete.id)
      .then(function () {
        setCandidatures((current) => current.filter((c) => c.id !== toDelete.id));
        toast.success("Candidature supprimée");
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
    <div className="candidatures-page">
      <div className="page-head">
        <div>
          <h1>{isCandidat ? "Mes candidatures" : "Candidatures"}</h1>
          <p className="text-muted">
            {isCandidat
              ? "Suivez l'état de vos candidatures."
              : "Consultez les candidatures qui vous concernent."}
          </p>
        </div>
      </div>

      <div className="page-toolbar">
        <Select
          id="candidatures-statut"
          label="Filtrer par statut"
          value={statut}
          onChange={(event) => {
            setStatut(event.target.value);
            setPage(0);
          }}
        >
          <option value="">Tous</option>
          {STATUT_VALUES.map((value) => (
            <option key={value} value={value}>
              {STATUT_LABELS[value]}
            </option>
          ))}
        </Select>
      </div>

      {status === "loading" && <Skeleton lines={5} />}

      {status === "error" && <ErrorState message={error} onRetry={load} />}

      {status === "success" && visible.length === 0 && (
        <EmptyState
          title={isCandidat ? "Aucune candidature" : "Aucune candidature trouvée"}
          message={
            isCandidat
              ? "Parcourez les offres disponibles et postulez."
              : "Changez de filtre pour voir plus de résultat."
          }
          action={
            isCandidat && (
              <Link to="/jobs" className="btn btn-primary">
                Voir les offres
              </Link>
            )
          }
        />
      )}

      {status === "success" && visible.length > 0 && (
        <>
          <div className="candidatures-grid">
            {visible.map((candidature) => (
              <article key={candidature.id} className="candidature-card">
                <StatusPill status={candidature.statut} />

                <h3 className="candidature-card-title">
                  <Link to={`/jobs/${candidature.offre?.id}`} className="table-link">
                    {candidature.offre?.titre || "—"}
                  </Link>
                </h3>

                <p className="candidature-card-meta">
                  {`Postulé le ${formatDate(candidature.dateCandidature)}`}
                  {!isCandidat &&
                    candidature.candidat &&
                    ` · ${candidature.candidat.prenom} ${candidature.candidat.nom}`}
                </p>

                <div className="job-card-actions">
                  <Link
                    to={`/consulter-candidature/${candidature.id}`}
                    className="btn btn-secondary btn-sm btn-icon"
                    title="Consulter"
                    aria-label="Consulter la candidature"
                  >
                    <VisibilityIcon />
                  </Link>
                  {candidature.cv && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="btn-icon"
                      title="Télécharger le CV"
                      aria-label="Télécharger le CV"
                      onClick={() =>
                        downloadCv(candidature.cv.id, candidature.cv.nomFichier).catch(function (reason) {
                          toast.error(getApiErrorMessage(reason, "Le téléchargement a échoué."));
                        })
                      }
                    >
                      <DownloadIcon />
                    </Button>
                  )}
                  {isManagement && (
                    <Button
                      variant="danger-solid"
                      size="sm"
                      className="btn-icon"
                      title="Supprimer"
                      aria-label="Supprimer la candidature"
                      onClick={() => setToDelete(candidature)}
                    >
                      <DeleteIcon />
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            size={size}
            onPageChange={setPage}
            onSizeChange={(next) => {
              setSize(next);
              setPage(0);
            }}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer la candidature"
        message={
          toDelete
            ? `Voulez-vous vraiment supprimer la candidature à l'offre « ${toDelete.offre?.titre || ""} » ?`
            : ""
        }
        confirmLabel="Supprimer"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
