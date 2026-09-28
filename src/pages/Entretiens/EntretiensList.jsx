import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { formatDate, formatDateTime } from "../../utils/format";
import { getRole, getUserId } from "../../component/token";
import Table from "../../component/ui/Table";
import Skeleton from "../../component/ui/Skeleton";
import ErrorState from "../../component/ui/ErrorState";
import EmptyState from "../../component/ui/EmptyState";
import ConfirmDialog from "../../component/ui/ConfirmDialog";
import Button from "../../component/ui/Button";
import StatusPill from "../../component/ui/StatusPill";

export default function EntretiensList() {
  const role = getRole();
  const userId = getUserId();
  const isAdmin = role === "ADMIN";
  const isRecruteur = role === "RECRUTEUR";
  const isCandidat = role === "CANDIDAT";

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [entretiens, setEntretiens] = useState([]);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [marking, setMarking] = useState(null);

  function load() {
    setStatus("loading");
    setError("");

    const request =
      role === "RECRUTEUR" && userId
        ? api.get("/entretiens/recruteur/" + userId, { params: { page: 0, size: 50 } })
        : api.get("/entretiens", { params: { page: 0, size: 50 } });

    request
      .then(function (response) {
        setEntretiens(response.data.content || []);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, [role, userId]);

  const canManageEntretien = (entretien) =>
    isAdmin || (isRecruteur && Number(entretien.recruteur?.id) === Number(userId));

  function handleDelete() {
    if (!toDelete) return;

    setDeleting(true);
    api
      .delete("/entretiens/" + toDelete.id)
      .then(function () {
        setEntretiens((current) => current.filter((e) => e.id !== toDelete.id));
        toast.success("Entretien supprimé");
        setToDelete(null);
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La suppression a échoué."));
      })
      .finally(function () {
        setDeleting(false);
      });
  }

  function handleMarkPassed(entretien) {
    if (!entretien || entretien.statut === "REUSSI") return;
    setMarking(entretien.id);

    api
      .patch(`/entretiens/${entretien.id}/resultat/REUSSI`)
      .then(function (response) {
        const updated = response.data;
        setEntretiens((current) => current.map((e) => (e.id === updated.id ? updated : e)));
        toast.success("Entretien marqué comme réussi");
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La mise à jour a échoué."));
      })
      .finally(function () {
        setMarking(null);
      });
  }

  const columns = [
    { key: "datetime", label: "Date" },
    { key: "lieu", label: "Lieu" },
    { key: "statut", label: "Statut" },
    { key: "candidature", label: "Candidature" },
    { key: "recruteur", label: "Recruteur" },
    { key: "actions", label: "Actions", className: "table-actions-col" },
  ];

  return (
    <div className="entretiens-page">
      <div className="page-head">
        <div>
          <h1>{isCandidat ? "Mes entretiens" : "Entretiens"}</h1>
          <p className="text-muted">
            {isCandidat
              ? "Consultez les entretiens planifiés pour vos candidatures."
              : "Planifiez et suivez vos entretiens."}
          </p>
        </div>
        {!isCandidat && (
          <Link to="/add-entretien" className="btn btn-primary">
            <AddIcon /> Planifier
          </Link>
        )}
      </div>

      {status === "loading" && <Skeleton lines={5} />}

      {status === "error" && <ErrorState message={error} onRetry={load} />}

      {status === "success" && entretiens.length === 0 && (
        <EmptyState
          title={isCandidat ? "Aucun entretien" : "Aucun entretien"}
          message={
            isCandidat
              ? "Aucun entretien n'est planifié pour le moment."
              : "Planifiez un entretien à partir d'une candidature."
          }
          action={
            !isCandidat && (
              <Link to="/add-entretien" className="btn btn-primary">
                Planifier
              </Link>
            )
          }
        />
      )}

      {status === "success" && entretiens.length > 0 && (
        <Table columns={columns}>
          {entretiens.map((entretien) => (
            <tr key={entretien.id}>
              <td>
                <Link to={`/consulter-entretien/${entretien.id}`} className="table-link">
                  {formatDateTime(`${entretien.date}T${entretien.heure}`)}
                </Link>
              </td>
              <td>{entretien.lieu}</td>
              <td>
                <StatusPill status={entretien.statut} />
              </td>
              <td>
                <Link
                  to={`/consulter-candidature/${entretien.candidatureId}`}
                  className="table-link"
                >
                  #{entretien.candidatureId}
                </Link>
              </td>
              <td>
                {entretien.recruteur
                  ? `${entretien.recruteur.prenom} ${entretien.recruteur.nom}`
                  : "—"}
              </td>
              <td className="table-actions-col">
                <Link
                  to={`/consulter-entretien/${entretien.id}`}
                  className="btn btn-secondary btn-sm btn-icon"
                  title="Consulter"
                  aria-label="Consulter l'entretien"
                >
                  <VisibilityIcon />
                </Link>
                {canManageEntretien(entretien) && (
                  <>
                    <Link
                      to={`/update-entretien/${entretien.id}`}
                      className="btn btn-secondary btn-sm btn-icon"
                      title="Modifier"
                      aria-label="Modifier l'entretien"
                    >
                      <EditIcon />
                    </Link>

                    <Button
                      variant="success-solid"
                      size="sm"
                      className="btn-icon"
                      title="Marquer réussi"
                      aria-label="Marquer l'entretien comme réussi"
                      onClick={() => handleMarkPassed(entretien)}
                      disabled={entretien.statut === "REUSSI" || marking === entretien.id}
                    >
                      <CheckCircleIcon />
                    </Button>

                    <Button
                      variant="danger-solid"
                      size="sm"
                      className="btn-icon"
                      title="Supprimer"
                      aria-label="Supprimer l'entretien"
                      onClick={() => setToDelete(entretien)}
                    >
                      <DeleteIcon />
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer l'entretien"
        message={
          toDelete
            ? `Voulez-vous vraiment supprimer l'entretien du ${formatDate(toDelete.date)} ?`
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
