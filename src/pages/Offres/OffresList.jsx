import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getRole, getUserId } from "../../Components/token";
import { CONTRAT_LABELS } from "../../utils/constants";
import JobCard from "../../Components/ui/JobCard";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import EmptyState from "../../Components/ui/EmptyState";
import Pagination from "../../Components/ui/Pagination";
import ConfirmDialog from "../../Components/ui/ConfirmDialog";
import Button from "../../Components/ui/Button";
import "./Offres.css";

export default function OffresList() {
  const role = getRole();
  const userId = getUserId();
  const isManagement = role === "ADMIN" || role === "RECRUTEUR";
  const isAdmin = role === "ADMIN";

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [offres, setOffres] = useState([]);
  const [type, setType] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function canManageOffre(offre) {
    return isAdmin || Number(offre.recruteurId) === Number(userId);
  }

  function load() {
    setStatus("loading");
    setError("");

    const request =
      role === "RECRUTEUR" && userId
        ? api.get("/offres/recruteur/" + userId, { params: { page: 0, size: 50 } })
        : api.get("/offres", { params: { page: 0, size: 50 } });

    request
      .then(function (response) {
        setOffres(response.data.content || []);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, [role, userId]);

  const filtered = type
    ? offres.filter((offre) => offre.typeContrat === type)
    : offres;

  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(currentPage * size, currentPage * size + size);

  function handleDelete() {
    if (!toDelete) return;

    setDeleting(true);
    api
      .delete("/offres/" + toDelete.id)
      .then(function () {
        setOffres((current) => current.filter((offre) => offre.id !== toDelete.id));
        toast.success("Offre supprimée");
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
    <div className="offres-list-page">
      <div className="page-head">
        <div>
          <h1>{isManagement ? "Offres d'emploi" : "Offres"}</h1>
          <p className="text-muted">
            {isManagement
              ? "Publiez, modifiez et suivez vos offres."
              : "Consultez les offres disponibles."}
          </p>
        </div>

        {isManagement && (
          <Link to="/add-offre" className="btn btn-primary">
            <AddIcon /> Nouvelle offre
          </Link>
        )}
      </div>

      <div className="page-toolbar">
        <select
          id="offres-type"
          className="field-select-inline"
          value={type}
          onChange={(event) => {
            setType(event.target.value);
            setPage(0);
          }}
          aria-label="Filtrer par type de contrat"
        >
          <option value="">Tous les types</option>
          {Object.entries(CONTRAT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {status === "loading" && <Skeleton lines={5} />}

      {status === "error" && <ErrorState message={error} onRetry={load} />}

      {status === "success" && visible.length === 0 && (
        <EmptyState
          title={isManagement ? "Aucune offre" : "Aucune offre trouvée"}
          message={
            isManagement
              ? "Créez votre première offre pour recevoir des candidatures."
              : "Modifiez votre filtre pour voir plus de résultat."
          }
          action={
            isManagement ? (
              <Link to="/add-offre" className="btn btn-primary">
                Nouvelle offre
              </Link>
            ) : (
              <Link to="/jobs" className="btn btn-secondary">
                Voir les offres
              </Link>
            )
          }
        />
      )}

      {status === "success" && visible.length > 0 && (
        <>
          <div className="offres-grid">
            {visible.map((offre) =>
              canManageOffre(offre) ? (
                <JobCard
                  key={offre.id}
                  offre={offre}
                  to={`/consulter-offre/${offre.id}`}
                  cta={false}
                  actions={
                    <>
                      <Link
                        to={`/consulter-offre/${offre.id}`}
                        className="btn btn-secondary btn-sm btn-icon"
                        title="Consulter"
                        aria-label="Consulter l'offre"
                      >
                        <VisibilityIcon />
                      </Link>
                      <Link
                        to={`/update-offre/${offre.id}`}
                        className="btn btn-secondary btn-sm btn-icon"
                        title="Modifier"
                        aria-label="Modifier l'offre"
                      >
                        <EditIcon />
                      </Link>
                      <Button
                        variant="danger-solid"
                        size="sm"
                        className="btn-icon"
                        title="Supprimer"
                        aria-label="Supprimer l'offre"
                        onClick={() => setToDelete(offre)}
                      >
                        <DeleteIcon />
                      </Button>
                    </>
                  }
                />
              ) : (
                <JobCard
                  key={offre.id}
                  offre={offre}
                  to={`/consulter-offre/${offre.id}`}
                  actionLabel="Consulter"
                />
              )
            )}
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
        title="Supprimer l'offre"
        message={`Voulez-vous vraiment supprimer l'offre « ${toDelete?.titre || ""} » ?`}
        confirmLabel="Supprimer"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}