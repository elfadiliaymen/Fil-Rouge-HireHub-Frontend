import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getRole } from "../../Components/token";
import { CONTRAT_LABELS } from "../../utils/constants";
import { formatDate } from "../../utils/format";
import StatusPill from "../../Components/ui/StatusPill";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import Button from "../../Components/ui/Button";
import "./Candidatures.css";

export default function ConsulterCandidature() {
  const { candidatureId } = useParams();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [candidature, setCandidature] = useState(null);
  const [updating, setUpdating] = useState(false);

  const role = getRole();
  const isManagement = role === "ADMIN" || role === "RECRUTEUR";

  function load() {
    setStatus("loading");
    setError("");

    api
      .get("/candidatures/" + candidatureId)
      .then(function (response) {
        setCandidature(response.data);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, [candidatureId]);

  function changeStatut(action) {
    setUpdating(true);

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
        setCandidature((current) => {
          const statut = action === "accepter" ? "ACCEPTEE" : action === "refuser" ? "REFUSEE" : "EN_ATTENTE";
          return current ? { ...current, statut } : current;
        });
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La mise à jour a échoué."));
      })
      .finally(function () {
        setUpdating(false);
      });
  }

  if (status === "loading") {
    return <Skeleton lines={5} />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={load} />;
  }

  const offre = candidature.offre || {};

  return (
    <div className="consulter-candidature-page">
      <div className="page-head">
        <div>
          <h1>Détail de la candidature</h1>
          <p className="text-muted">
            Candidature du {formatDate(candidature.dateCandidature)}.
          </p>
        </div>
        <StatusPill status={candidature.statut} />
      </div>

      <div className="detail-card">
        <dl className="detail-grid">
          <div className="detail-field">
            <dt>Statut</dt>
            <dd>
              <StatusPill status={candidature.statut} />
            </dd>
          </div>
          <div className="detail-field">
            <dt>Date de candidature</dt>
            <dd>{formatDate(candidature.dateCandidature)}</dd>
          </div>
          {candidature.candidat && (
            <div className="detail-field">
              <dt>Candidat</dt>
              <dd>
                {candidature.candidat.prenom} {candidature.candidat.nom}
              </dd>
            </div>
          )}
          <div className="detail-field">
            <dt>Émail candidat</dt>
            <dd>{candidature.candidat?.email || "—"}</dd>
          </div>
        </dl>

        {isManagement && (
          <div className="statut-actions">
            <span className="statut-actions-label">Changer le statut :</span>
            <Button
              variant="success"
              size="sm"
              className="btn-icon"
              title="Accepter"
              aria-label="Accepter la candidature"
              disabled={updating || candidature.statut === "ACCEPTEE"}
              onClick={() => changeStatut("accepter")}
            >
              <CheckIcon />
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="btn-icon"
              title="Refuser"
              aria-label="Refuser la candidature"
              disabled={updating || candidature.statut === "REFUSEE"}
              onClick={() => changeStatut("refuser")}
            >
              <CloseIcon />
            </Button>
            <Button
              variant="subtle"
              size="sm"
              className="btn-icon"
              title="En attente"
              aria-label="Remettre la candidature en attente"
              disabled={updating || candidature.statut === "EN_ATTENTE"}
              onClick={() => changeStatut("attente")}
            >
              <ScheduleIcon />
            </Button>
          </div>
        )}
      </div>

      <div className="detail-card">
        <div className="detail-card-head">
          <h2>Offre concernée</h2>
          <Link to={`/jobs/${offre.id}`} className="btn btn-secondary btn-sm">
            Voir l'offre
          </Link>
        </div>

        <dl className="detail-grid">
          <div className="detail-field">
            <dt>Titre</dt>
            <dd>{offre.titre || "—"}</dd>
          </div>
          <div className="detail-field">
            <dt>Type de contrat</dt>
            <dd>{CONTRAT_LABELS[offre.typeContrat] || offre.typeContrat || "—"}</dd>
          </div>
          <div className="detail-field">
            <dt>Localisation</dt>
            <dd>{offre.localisation || "—"}</dd>
          </div>
          <div className="detail-field">
            <dt>Date limite</dt>
            <dd>{formatDate(offre.dateLimite)}</dd>
          </div>
        </dl>

        {offre.description && (
          <p className="detail-description">{offre.description}</p>
        )}
      </div>

      <Link to="/candidatures" className="btn btn-secondary">
        <ArrowBackIcon /> Mes candidatures
      </Link>
    </div>
  );
}