import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getRole, getUserId, isAuthenticated } from "../../component/token";
import { CONTRAT_LABELS } from "../../utils/constants";
import { formatDate, isExpiringSoon } from "../../utils/format";
import Skeleton from "../../component/ui/Skeleton";
import ErrorState from "../../component/ui/ErrorState";
import Button from "../../component/ui/Button";
import Select from "../../component/ui/Select";

export default function OffrePublique() {
  const { offreId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [offre, setOffre] = useState(null);
  const [posting, setPosting] = useState(false);
  const [cvs, setCvs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState("");

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
    if (!isAuthenticated() || getRole() !== "CANDIDAT") return;

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
  }, [offreId]);

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

  function handlePrint() {
    window.print();
  }

  if (status === "loading") {
    return (
      <div className="job-detail-page container">
        <Skeleton lines={6} />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="job-detail-page container">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  const role = getRole();
  const expiringSoon = isExpiringSoon(offre.dateLimite, 3);

  return (
    <div className="job-detail-page container">
      <Link to="/jobs" className="back-link">
        <ArrowBackIcon /> Offres
      </Link>

      <article className="job-detail">
        <div className="job-detail-head">
          <div className="job-detail-title-block">
            <h1>{offre.titre}</h1>
            <div className="job-detail-badges">
              <span className="badge badge-accent">
                {CONTRAT_LABELS[offre.typeContrat] || offre.typeContrat}
              </span>
              {expiringSoon && <span className="job-card-urgent">Expire bientôt</span>}
            </div>
          </div>

          <div className="job-detail-actions">
            {isAuthenticated() && role === "CANDIDAT" ? (
              cvs.length === 0 ? (
                <Link to="/cvs-actions" className="btn btn-secondary">
                  Ajouter un CV pour postuler
                </Link>
              ) : (
                <div className="postuler-box">
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
                  <Button onClick={handlePostuler} disabled={posting || !selectedCvId} size="lg">
                    {posting ? "Envoi…" : "Postuler"}
                  </Button>
                </div>
              )
            ) : isAuthenticated() ? (
              <Link to="/dashboard" className="btn btn-secondary">
                Accéder à mon espace
              </Link>
            ) : (
              <Link to="/auth" className="btn btn-primary">
                Se connecter pour postuler
              </Link>
            )}
            <Button variant="secondary" onClick={handlePrint} size="lg">
              Imprimer / PDF
            </Button>
          </div>
        </div>

        <dl className="job-detail-meta">
          <div>
            <dt>Localisation</dt>
            <dd>{offre.localisation || "—"}</dd>
          </div>
          <div>
            <dt>Date limite</dt>
            <dd>{formatDate(offre.dateLimite)}</dd>
          </div>
          <div>
            <dt>Recruteur</dt>
            <dd>
              {offre.recruteur
                ? `${offre.recruteur.prenom} ${offre.recruteur.nom}`
                : "—"}
            </dd>
          </div>
        </dl>

        <section className="job-detail-section">
          <h2>Description du poste</h2>
          <p>{offre.description}</p>
        </section>
      </article>
    </div>
  );
}
