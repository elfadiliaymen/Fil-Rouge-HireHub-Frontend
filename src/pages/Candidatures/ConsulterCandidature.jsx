import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";

function ConsulterCandidature() {
  const { candidatureId } = useParams();
  const [candidature, setCandidature] = useState(null);

  useEffect(() => {
    api.get(`/candidatures/${candidatureId}`)
      .then((res) => setCandidature(res.data))
      .catch((err) => console.log(err));
  }, [candidatureId]);

  if (!candidature) {
    return (
      <div className="page">
        <h2>Chargement...</h2>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="patient-sheet">
        <div className="sheet-header">
          <div>
            <h1>Fiche de la Candidature</h1>
            <p>
              Informations de la candidature
            </p>
          </div>

          <Link
            to={`/update-candidature/${candidature.id}`}
            className="btn-edit"
          >
            Modifier
          </Link>
        </div>

        <div className="patient-infos">
          <div className="info-box">
            <span>ID</span>
            <strong>{candidature.id}</strong>
          </div>

          <div className="info-box">
            <span>Date</span>
            <strong>{candidature.dateCandidature}</strong>
          </div>

          <div className="info-box">
            <span>Statut</span>
            <strong>{candidature.statut}</strong>
          </div>

          <div className="info-box">
            <span>Candidat</span>
            <strong>
              {candidature.candidat?.prenom} {candidature.candidat?.nom}
            </strong>
          </div>

          <div className="info-box">
            <span>Email candidat</span>
            <strong>{candidature.candidat?.email}</strong>
          </div>

          <div className="info-box">
            <span>Offre</span>
            <strong>{candidature.offre?.titre}</strong>
          </div>

          <div className="info-box">
            <span>Description</span>
            <strong>{candidature.offre?.description}</strong>
          </div>

          <div className="info-box">
            <span>Localisation</span>
            <strong>{candidature.offre?.localisation}</strong>
          </div>

          <div className="info-box">
            <span>Type de contrat</span>
            <strong>{candidature.offre?.typeContrat}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsulterCandidature;