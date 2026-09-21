import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getUserId } from "../../Components/token";
import { ROLE_LABELS } from "../../utils/constants";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import ConfirmDialog from "../../Components/ui/ConfirmDialog";
import Button from "../../Components/ui/Button";
import "./Users.css";

export default function ConsulterUser() {
  const { userId } = useParams();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [toDelete, setToDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const isSelf = user ? user.id === getUserId() : false;

  function load() {
    setStatus("loading");
    setError("");

    api
      .get("/users/" + userId)
      .then(function (response) {
        setUser(response.data);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, [userId]);

  function handleToggle() {
    setBusy(true);
    const url = user.active ? "/users/" + user.id + "/deactivate" : "/users/" + user.id + "/activate";

    api
      .patch(url)
      .then(function (response) {
        setUser(response.data);
        toast.success(user.active ? "Compte désactivé" : "Compte activé");
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "L'opération a échoué."));
      })
      .finally(function () {
        setBusy(false);
      });
  }

  function handleDelete() {
    setBusy(true);

    api
      .delete("/users/" + user.id)
      .then(function () {
        toast.success("Utilisateur supprimé");
        setToDelete(false);
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La suppression a échoué."));
        setBusy(false);
      });
  }

  if (status === "loading") {
    return <Skeleton lines={5} />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <div className="consulter-user-page">
      <div className="page-head">
        <div>
          <Link to="/users" className="back-link">
            <ArrowBackIcon /> Utilisateurs
          </Link>
          <h1>
            {user.prenom} {user.nom}
          </h1>
          <span className="badge badge-accent">{ROLE_LABELS[user.role] || user.role}</span>
        </div>

        <div className="actions">
          <Link
            to={`/update-user/${user.id}`}
            className="btn btn-secondary btn-icon"
            title="Modifier"
            aria-label="Modifier l'utilisateur"
          >
            <EditIcon />
          </Link>
          {!isSelf && (
            <>
              <Button
                variant="secondary"
                className="btn-icon"
                title={user.active ? "Désactiver" : "Activer"}
                aria-label={user.active ? "Désactiver le compte" : "Activer le compte"}
                disabled={busy}
                onClick={handleToggle}
              >
                {user.active ? <BlockIcon /> : <CheckCircleIcon />}
              </Button>
              <Button
                variant="danger-solid"
                className="btn-icon"
                title="Supprimer"
                aria-label="Supprimer l'utilisateur"
                disabled={busy}
                onClick={() => setToDelete(true)}
              >
                <DeleteIcon />
              </Button>
            </>
          )}
        </div>
      </div>

      <dl className="detail-grid">
        <div className="detail-field">
          <dt>Identifiant</dt>
          <dd>#{user.id}</dd>
        </div>
        <div className="detail-field">
          <dt>Nom</dt>
          <dd>{user.nom}</dd>
        </div>
        <div className="detail-field">
          <dt>Prénom</dt>
          <dd>{user.prenom}</dd>
        </div>
        <div className="detail-field">
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="detail-field">
          <dt>Rôle</dt>
          <dd>{ROLE_LABELS[user.role] || user.role}</dd>
        </div>
        <div className="detail-field">
          <dt>Statut du compte</dt>
          <dd>
            <span className={user.active ? "pill pill-ok" : "pill pill-dim"}>
              {user.active ? "Actif" : "Inactif"}
            </span>
          </dd>
        </div>
        {user.telephone && (
          <div className="detail-field">
            <dt>Téléphone</dt>
            <dd>{user.telephone}</dd>
          </div>
        )}
        {user.adresse && (
          <div className="detail-field">
            <dt>Adresse</dt>
            <dd>{user.adresse}</dd>
          </div>
        )}
        {(user.role === "RECRUTEUR" || user.role === "ADMIN") && (
          <>
            {user.entreprise && (
              <div className="detail-field">
                <dt>Entreprise</dt>
                <dd>{user.entreprise}</dd>
              </div>
            )}
            {user.poste && (
              <div className="detail-field">
                <dt>Poste</dt>
                <dd>{user.poste}</dd>
              </div>
            )}
            {user.telephonePro && (
              <div className="detail-field">
                <dt>Téléphone professionnel</dt>
                <dd>{user.telephonePro}</dd>
              </div>
            )}
          </>
        )}
        {user.role === "CANDIDAT" && (
          <>
            {user.dateNaissance && (
              <div className="detail-field">
                <dt>Date de naissance</dt>
                <dd>{user.dateNaissance}</dd>
              </div>
            )}
            {user.niveauEtude && (
              <div className="detail-field">
                <dt>Niveau d'étude</dt>
                <dd>{user.niveauEtude}</dd>
              </div>
            )}
            <div className="detail-field">
              <dt>Années d'expérience</dt>
              <dd>{user.experienceAnnees ?? 0}</dd>
            </div>
            {user.linkedinUrl && (
              <div className="detail-field">
                <dt>LinkedIn</dt>
                <dd>
                  <a href={user.linkedinUrl} target="_blank" rel="noreferrer">
                    {user.linkedinUrl}
                  </a>
                </dd>
              </div>
            )}
          </>
        )}
      </dl>

      <ConfirmDialog
        open={toDelete}
        title="Supprimer l'utilisateur"
        message={`Voulez-vous vraiment supprimer le compte de « ${user.prenom} ${user.nom} » ?`}
        confirmLabel="Supprimer"
        loading={busy}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(false)}
      />
    </div>
  );
}