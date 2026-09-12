import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";

function ConsulterEntretien() {
  const { entretienId } = useParams();
  const [entretien, setEntretien] = useState(null);

  useEffect(() => {
    api.get(`/entretiens/${entretienId}`)
      .then((res) => setEntretien(res.data))
      .catch((err) => console.log(err));
  }, [entretienId]);

  if (!entretien) {
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
            <h1>Fiche de l'Entretien</h1>
            <p>
              Informations de l'entretien
            </p>
          </div>

          <Link
            to={`/update-entretien/${entretien.id}`}
            className="btn-edit"
          >
            Modifier
          </Link>
        </div>

        <div className="patient-infos">
          <div className="info-box">
            <span>ID</span>
            <strong>{entretien.id}</strong>
          </div>

          <div className="info-box">
            <span>Date</span>
            <strong>{entretien.date}</strong>
          </div>

          <div className="info-box">
            <span>Heure</span>
            <strong>{entretien.heure}</strong>
          </div>

          <div className="info-box">
            <span>Lieu</span>
            <strong>{entretien.lieu}</strong>
          </div>

          <div className="info-box">
            <span>Candidature</span>
            <strong>{entretien.candidatureId}</strong>
          </div>

          <div className="info-box">
            <span>Recruteur</span>
            <strong>
              {entretien.recruteur?.prenom} {entretien.recruteur?.nom}
            </strong>
          </div>

          <div className="info-box">
            <span>Email recruteur</span>
            <strong>{entretien.recruteur?.email}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsulterEntretien;