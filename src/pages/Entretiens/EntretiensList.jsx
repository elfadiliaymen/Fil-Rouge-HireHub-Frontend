import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { formatDate, formatDateTime } from "../../utils/format";
import { getRole, getUserId } from "../../Components/token";
import Table from "../../Components/ui/Table";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import EmptyState from "../../Components/ui/EmptyState";
import ConfirmDialog from "../../Components/ui/ConfirmDialog";
import Button from "../../Components/ui/Button";
import "./Entretiens.css";

export default function EntretiensList() {
  const role = getRole();
  const userId = getUserId();
  const isAdmin = role === "ADMIN";

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [entretiens, setEntretiens] = useState([]);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
    isAdmin || Number(entretien.recruteur?.id) === Number(userId);

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

  const columns = [
    { key: "datetime", label: "Date" },
    { key: "lieu", label: "Lieu" },
    { key: "candidature", label: "Candidature" },
    { key: "recruteur", label: "Recruteur" },
    { key: "actions", label: "Actions", className: "table-actions-col" },
  ];

  return (
    <div className="entretiens-page">
      <div className="page-head">
        <div>
          <h1>Entretiens</h1>
          <p className="text-muted">Planifiez et suivez vos entretiens.</p>
        </div>
        <Link to="/add-entretien" className="btn btn-primary">
          <AddIcon /> Planifier
        </Link>
      </div>

      {status === "loading" && <Skeleton lines={5} />}

      {status === "error" && <ErrorState message={error} onRetry={load} />}

      {status === "success" && entretiens.length === 0 && (
        <EmptyState
          title="Aucun entretien"
          message="Planifiez un entretien à partir d'une candidature."
          action={
            <Link to="/add-entretien" className="btn btn-primary">
              Planifier
            </Link>
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
              <td>#{entretien.candidatureId}</td>
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