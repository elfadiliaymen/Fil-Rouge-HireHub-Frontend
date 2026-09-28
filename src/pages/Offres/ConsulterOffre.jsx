import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getRole, getUserId, getUser } from "../../component/token";
import { CONTRAT_LABELS } from "../../utils/constants";
import { formatDate, isExpiringSoon } from "../../utils/format";
import { downloadCv } from "../../utils/download";
import StatusPill from "../../component/ui/StatusPill";
import Skeleton from "../../component/ui/Skeleton";
import ErrorState from "../../component/ui/ErrorState";
import Button from "../../component/ui/Button";
import Select from "../../component/ui/Select";

export default function ConsulterOffre() {
  const { offreId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [offre, setOffre] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [posting, setPosting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [cvs, setCvs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");

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
    if (!isCandidat) return;

    api
      .get("/cv", { params: { page: 0, size: 100 } })
      .then(function (response) {
        const list = response.data.content || [];
        setCvs(list);
        if (list.length > 0) {
          setSelectedCvId(list[0].id);
        }
      })
      .catch(function () {});
  }, [isCandidat]);

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

  useEffect(() => {
    const isOwner =
      role === "ADMIN" ||
      (status === "success" && offre && Number(offre.recruteurId) === Number(currentUserId));
    if (!isOwner || !offre) return;

    if (role === "ADMIN") {
      api
        .get("/users/" + offre.recruteurId)
        .then(function (response) {
          setRecruiterEmail(response.data.email || "");
        })
        .catch(function () {
          setRecruiterEmail("");
        });
      return;
    }

    const session = getUser();
    setRecruiterEmail((session && session.email) || "");
  }, [isManagement, status, offre, offreId, role, currentUserId]);

  const canManage =
    role === "ADMIN" ||
    (status === "success" && offre && Number(offre.recruteurId) === Number(currentUserId));

  function handlePostuler() {
    if (!selectedCvId) {
      toast.error("Choisissez d'abord le CV à utiliser pour postuler.");
      return;
    }

    setPosting(true);

    api
      .post("/candidatures", { candidatId: getUserId(), offreId, cvId: selectedCvId })
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
            <div className="postuler-box">
              {cvs.length === 0 ? (
                <Link to="/cvs-actions" className="btn btn-secondary">
                  Ajouter un CV pour postuler
                </Link>
              ) : (
                <>
                  <Select
                    id="postuler-cv"
                    aria-label="Choisir le CV à utiliser"
                    value={selectedCvId}
                    onChange={(event) => setSelectedCvId(Number(event.target.value))}
                  >
                    <option value="">CV utilisé…</option>
                    {cvs.map((cv) => (
                      <option key={cv.id} value={cv.id}>
                        {cv.nomFichier}
                      </option>
                    ))}
                  </Select>
                  <Button
                    className="btn-icon"
                    title={posting ? "Envoi…" : "Postuler"}
                    aria-label={posting ? "Envoi…" : "Postuler"}
                    onClick={handlePostuler}
                    disabled={posting || !selectedCvId}
                  >
                    <SendIcon />
                  </Button>
                </>
              )}
            </div>
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
        {canManage && recruiterEmail && (
          <div className="detail-field">
            <dt>Email recruteur</dt>
            <dd>{recruiterEmail}</dd>
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
                    {candidature.statut === "EN_ATTENTE" && (
                      <>
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
                      </>
                    )}
                    {candidature.statut === "ACCEPTEE" && (
                      <Button
                        variant="subtle"
                        size="sm"
                        disabled={updatingId === candidature.id}
                        onClick={() => changeStatut(candidature.id, "attente")}
                      >
                        En attente
                      </Button>
                    )}
                    {candidature.cv && (
                      <Button
                        variant="subtle"
                        size="sm"
                        className="btn-icon"
                        title="Télécharger le CV"
                        aria-label="Télécharger le CV du candidat"
                        onClick={() =>
                          downloadCv(candidature.cv.id, candidature.cv.nomFichier).catch(function (reason) {
                            toast.error(getApiErrorMessage(reason, "Le téléchargement a échoué."));
                          })
                        }
                      >
                        <DownloadIcon />
                      </Button>
                    )}
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
