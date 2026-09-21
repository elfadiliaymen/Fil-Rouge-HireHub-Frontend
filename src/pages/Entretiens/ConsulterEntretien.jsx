import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { formatDate, formatDateTime } from "../../utils/format";
import { getRole, getUserId } from "../../Components/token";
import StatusPill from "../../Components/ui/StatusPill";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import "./Entretiens.css";

export default function ConsulterEntretien() {
  const { entretienId } = useParams();
  const role = getRole();
  const userId = getUserId();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [entretien, setEntretien] = useState(null);
  const [candidature, setCandidature] = useState(null);

  function load() {
    setStatus("loading");
    setError("");

    api
      .get("/entretiens/" + entretienId)
      .then(function (response) {
        setEntretien(response.data);
        if (!response.data.candidatureId) return;

        return api
          .get("/candidatures/" + response.data.candidatureId)
          .then(function (candResponse) {
            setCandidature(candResponse.data);
          })
          .catch(function () {
            setCandidature(null);
          });
      })
      .then(function () {
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, [entretienId]);

  if (status === "loading") {
    return <Skeleton lines={5} />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={load} />;
  }

  const canManage =
    role === "ADMIN" ||
    Number(entretien?.recruteur?.id) === Number(userId);

  return (
    <div className="consulter-entretien-page">
      <div className="page-head">
        <div>
          <h1>Détail de l'entretien</h1>
          <p className="text-muted">
            Le {formatDateTime(`${entretien.date}T${entretien.heure}`)}.
          </p>
        </div>
        <div className="actions">
          <Link to="/entretiens" className="btn btn-secondary">
            <ArrowBackIcon /> Entretiens
          </Link>
          {canManage && (
            <Link
              to={`/update-entretien/${entretien.id}`}
              className="btn btn-primary btn-icon"
              title="Modifier"
              aria-label="Modifier l'entretien"
            >
              <EditIcon />
            </Link>
          )}
        </div>
      </div>

      <dl className="detail-grid">
        <div className="detail-field">
          <dt>Date</dt>
          <dd>{formatDate(entretien.date)}</dd>
        </div>
        <div className="detail-field">
          <dt>Heure</dt>
          <dd>{entretien.heure}</dd>
        </div>
        <div className="detail-field">
          <dt>Lieu</dt>
          <dd>{entretien.lieu}</dd>
        </div>
        <div className="detail-field">
          <dt>Recruteur</dt>
          <dd>
            {entretien.recruteur
              ? `${entretien.recruteur.prenom} ${entretien.recruteur.nom}`
              : "—"}
          </dd>
        </div>
      </dl>

      {candidature && (
        <div className="detail-card">
          <h2>Candidature liée</h2>
          <dl className="detail-grid">
            <div className="detail-field">
              <dt>Identifiant</dt>
              <dd>#{candidature.id}</dd>
            </div>
            <div className="detail-field">
              <dt>Candidat</dt>
              <dd>
                {candidature.candidat?.prenom} {candidature.candidat?.nom}
              </dd>
            </div>
            <div className="detail-field">
              <dt>Statut</dt>
              <dd>
                <StatusPill status={candidature.statut} />
              </dd>
            </div>
            <div className="detail-field">
              <dt>Offre</dt>
              <dd>
                <Link to={`/jobs/${candidature.offre?.id}`} className="table-link">
                  {candidature.offre?.titre || "—"}
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}