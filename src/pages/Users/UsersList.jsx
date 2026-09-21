import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getUserId } from "../../Components/token";
import { ROLE_LABELS } from "../../utils/constants";
import Table from "../../Components/ui/Table";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import EmptyState from "../../Components/ui/EmptyState";
import Pagination from "../../Components/ui/Pagination";
import ConfirmDialog from "../../Components/ui/ConfirmDialog";
import Button from "../../Components/ui/Button";
import "./Users.css";

export default function UsersList() {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [toDelete, setToDelete] = useState(null);
  const [toToggle, setToToggle] = useState(null);
  const [busy, setBusy] = useState(false);

  const currentUserId = getUserId();

  function load() {
    setStatus("loading");
    setError("");

    api
      .get("/users", { params: { page: 0, size: 100 } })
      .then(function (response) {
        setUsers(response.data.content || []);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, []);

  let filtered = users;

  if (roleFilter) {
    filtered = filtered.filter((user) => user.role === roleFilter);
  }

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    filtered = filtered.filter(
      (user) =>
        `${user.nom} ${user.prenom}`.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(currentPage * size, currentPage * size + size);

  function handleToggle() {
    if (!toToggle) return;

    setBusy(true);
    const url = toToggle.active ? "/users/" + toToggle.id + "/deactivate" : "/users/" + toToggle.id + "/activate";

    api
      .patch(url)
      .then(function (response) {
        setUsers((current) =>
          current.map((user) => (user.id === toToggle.id ? response.data : user))
        );
        toast.success(toToggle.active ? "Compte désactivé" : "Compte activé");
        setToToggle(null);
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "L'opération a échoué."));
      })
      .finally(function () {
        setBusy(false);
      });
  }

  function handleDelete() {
    if (!toDelete) return;

    setBusy(true);
    api
      .delete("/users/" + toDelete.id)
      .then(function () {
        setUsers((current) => current.filter((user) => user.id !== toDelete.id));
        toast.success("Utilisateur supprimé");
        setToDelete(null);
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La suppression a échoué."));
      })
      .finally(function () {
        setBusy(false);
      });
  }

  const columns = [
    { key: "name", label: "Nom" },
    { key: "email", label: "Email" },
    { key: "role", label: "Rôle" },
    { key: "active", label: "Statut" },
    { key: "actions", label: "Actions", className: "table-actions-col" },
  ];

  return (
    <div className="users-page">
      <div className="page-head">
        <div>
          <h1>Utilisateurs</h1>
          <p className="text-muted">Gérez les comptes de la plateforme.</p>
        </div>
        <Link to="/add-user" className="btn btn-primary">
          <AddIcon /> Nouvel utilisateur
        </Link>
      </div>

      <div className="page-toolbar">
        <input
          type="search"
          className="toolbar-search"
          placeholder="Rechercher (nom, email)…"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
          aria-label="Rechercher un utilisateur"
        />
        <select
          className="field-select-inline"
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(event.target.value);
            setPage(0);
          }}
          aria-label="Filtrer par rôle"
        >
          <option value="">Tous les rôles</option>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {status === "loading" && <Skeleton lines={6} />}

      {status === "error" && <ErrorState message={error} onRetry={load} />}

      {status === "success" && visible.length === 0 && (
        <EmptyState
          title="Aucun utilisateur"
          message="Aucun compte ne correspond à la recherche."
        />
      )}

      {status === "success" && visible.length > 0 && (
        <>
          <Table columns={columns}>
            {visible.map((user) => {
              const isSelf = user.id === currentUserId;

              return (
                <tr key={user.id}>
                  <td>
                    <Link to={`/consulter-user/${user.id}`} className="table-link">
                      {user.prenom} {user.nom}
                      {isSelf && <span className="tag-self">vous</span>}
                    </Link>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge badge-accent">
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td>
                    <span className={user.active ? "pill pill-ok" : "pill pill-dim"}>
                      {user.active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="table-actions-col">
                    <Link
                      to={`/consulter-user/${user.id}`}
                      className="btn btn-secondary btn-sm btn-icon"
                      title="Consulter"
                      aria-label="Consulter l'utilisateur"
                    >
                      <VisibilityIcon />
                    </Link>
                    <Link
                      to={`/update-user/${user.id}`}
                      className="btn btn-secondary btn-sm btn-icon"
                      title="Modifier"
                      aria-label="Modifier l'utilisateur"
                    >
                      <EditIcon />
                    </Link>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="btn-icon"
                      title={user.active ? "Désactiver" : "Activer"}
                      aria-label={user.active ? "Désactiver le compte" : "Activer le compte"}
                      disabled={isSelf}
                      onClick={() => setToToggle(user)}
                    >
                      {user.active ? <BlockIcon /> : <CheckCircleIcon />}
                    </Button>
                    <Button
                      variant="danger-solid"
                      size="sm"
                      className="btn-icon"
                      title="Supprimer"
                      aria-label="Supprimer l'utilisateur"
                      disabled={isSelf}
                      onClick={() => setToDelete(user)}
                    >
                      <DeleteIcon />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </Table>

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
        open={Boolean(toToggle)}
        title={toToggle?.active ? "Désactiver le compte" : "Activer le compte"}
        message={`Voulez-vous ${toToggle?.active ? "désactiver" : "activer"} le compte de « ${toToggle?.prenom} ${toToggle?.nom} » ?`}
        confirmLabel={toToggle?.active ? "Désactiver" : "Activer"}
        loading={busy}
        onConfirm={handleToggle}
        onCancel={() => setToToggle(null)}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer l'utilisateur"
        message={`Voulez-vous vraiment supprimer le compte de « ${toDelete?.prenom} ${toDelete?.nom} » ?`}
        confirmLabel="Supprimer"
        loading={busy}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}