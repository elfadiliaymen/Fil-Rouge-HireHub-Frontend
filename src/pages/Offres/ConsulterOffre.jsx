import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getRole, getUserId } from "../../Components/token";
import { CONTRAT_LABELS } from "../../utils/constants";
import { formatDate, isExpiringSoon } from "../../utils/format";
import StatusPill from "../../Components/ui/StatusPill";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import Button from "../../Components/ui/Button";
import "./Offres.css";

export default function ConsulterOffre() {
  const { offreId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [offre, setOffre] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [posting, setPosting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const role = getRole();
  const currentUserId = getUserId();
  const isManagement = role === "ADMIN" || role === "RECRUTEUR";
  const isCandidat = role === "CANDIDAT";

  function load() {
    setStatus("loading");
    setError("");

    api
      .get("/offres/" + offreId)
      .then(function (response) {
        setOffre(response.data);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, [offreId]);

  useEffect(() => {
    const isOwner =
      role === "ADMIN" ||
      (status === "success" && offre && Number(offre.recruteurId) === Number(currentUserId));
    if (!isOwner) return;

    api
      .get("/offres/" + offreId + "/candidatures")
      .then(function (response) {
        setCandidatures(response.data.content || []);
      })
      .catch(function () {
        setCandidatures([]);
      });
  }, [isManagement, status, offre, offreId, role, currentUserId]);

  const canManage =
    role === "ADMIN" ||
    (status === "success" && offre && Number(offre.recruteurId) === Number(currentUserId));

  function handlePostuler() {
    setPosting(true);

    api
      .post("/candidatures", { candidatId: getUserId(), offreId })
      .then(function () {
        toast.success("Candidature soumise avec succès !");
        navigate("/candidatures");
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La candidature a échoué."));
        setPosting(false);
      });
  }

  function changeStatut(candidatureId, action) {
    setUpdatingId(candidatureId);

    const url =
      action === "accepter"
        ? `/candidatures/${candidatureId}/accepter`
        : action === "refuser"
          ? `/candidatures/${candidatureId}/refuser`
          : `/candidatures/${candidatureId}/en-attente`;

    api
      .patch(url)
      .then(function () {
        const label = action === "accepter" ? "acceptée" : action === "refuser" ? "refusée" : "remise en attente";
        toast.success(`Candidature ${label}`);
        setCandidatures((current) =>
          current.map((c) => {
            if (c.id !== candidatureId) return c;
            const statut = action === "accepter" ? "ACCEPTEE" : action === "refuser" ? "REFUSEE" : "EN_ATTENTE";
            return { ...c, statut };
          })
        );
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La mise à jour a échoué."));
      })
      .finally(function () {
        setUpdatingId(null);
      });
  }

  if (status === "loading") {
    return <Skeleton lines={6} />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={load} />;
  }

  const expiringSoon = isExpiringSoon(offre.dateLimite, 3);

  return (
    <div className="consulter-offre-page">
      <div className="page-head">
        <div>
          {isCandidat ? (
            <Link to="/offres" className="back-link">
              <ArrowBackIcon /> Offres
            </Link>
          ) : (
            <Link to="/offres" className="back-link">
              <ArrowBackIcon /> Liste des offres
            </Link>
          )}
          <h1>{offre.titre}</h1>
          <div className="badges">
            <span className="badge badge-accent">
              {CONTRAT_LABELS[offre.typeContrat] || offre.typeContrat}
            </span>
            {expiringSoon && <span className="job-card-urgent">Expire bientôt</span>}
          </div>
        </div>

        <div className="actions">
          {isCandidat && (
            <Button
              className="btn-icon"
              title={posting ? "Envoi…" : "Postuler"}
              aria-label={posting ? "Envoi…" : "Postuler"}
              onClick={handlePostuler}
              disabled={posting}
            >
              <SendIcon />
            </Button>
          )}
          {canManage && (
            <Link
              to={`/update-offre/${offre.id}`}
              className="btn btn-secondary btn-icon"
              title="Modifier l'offre"
              aria-label="Modifier l'offre"
            >
              <EditIcon />
            </Link>
          )}
        </div>
      </div>

      <dl className="detail-grid">
        <div className="detail-field">
          <dt>Localisation</dt>
          <dd>{offre.localisation || "—"}</dd>
        </div>
        <div className="detail-field">
          <dt>Date limite</dt>
          <dd>{formatDate(offre.dateLimite)}</dd>
        </div>
        <div className="detail-field">
          <dt>Recruteur</dt>
          <dd>
            {offre.recruteur
              ? `${offre.recruteur.prenom} ${offre.recruteur.nom}`
              : "—"}
          </dd>
        </div>
        {canManage && offre.recruteur?.email && (
          <div className="detail-field">
            <dt>Email recruteur</dt>
            <dd>{offre.recruteur.email}</dd>
          </div>
        )}
      </dl>

      <div className="detail-card">
        <h2>Description du poste</h2>
        <p className="description">{offre.description}</p>
      </div>

      {canManage && (
        <div className="detail-card">
          <div className="section-head">
            <h2>Candidatures reçues</h2>
            <Link to="/candidatures" className="btn btn-secondary btn-sm">
              Toutes les candidatures
            </Link>
          </div>

          {candidatures.length === 0 ? (
            <p className="text-muted">Aucune candidature pour cette offre.</p>
          ) : (
            <div className="candidatures-liste">
              {candidatures.map((candidature) => (
                <div key={candidature.id} className="candidature-row">
                  <div className="candidature-info">
                    <strong>
                      {candidature.candidat?.prenom} {candidature.candidat?.nom}
                    </strong>
                    <span className="text-muted text-sm">
                      Postulé le {formatDate(candidature.dateCandidature)}
                    </span>
                  </div>

                  <StatusPill status={candidature.statut} />

                  <div className="candidature-actions">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={updatingId === candidature.id}
                      onClick={() => changeStatut(candidature.id, "accepter")}
                    >
                      Accepter
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={updatingId === candidature.id}
                      onClick={() => changeStatut(candidature.id, "refuser")}
                    >
                      Refuser
                    </Button>
                    <Button
                      variant="subtle"
                      size="sm"
                      disabled={updatingId === candidature.id}
                      onClick={() => changeStatut(candidature.id, "attente")}
                    >
                      En attente
                    </Button>
                    <Link
                      to={`/consulter-candidature/${candidature.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      Détail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}