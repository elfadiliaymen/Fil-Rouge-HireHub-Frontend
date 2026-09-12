import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";

function ConsulterOffre() {
  const { offreId } = useParams();
  const [offre, setOffre] = useState(null);

  useEffect(() => {
    api.get(`/offres/${offreId}`)
      .then((res) => setOffre(res.data))
      .catch((err) => console.log(err));
  }, [offreId]);

  if (!offre) {
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
            <h1>Fiche de l'Offre</h1>
            <p>
              Informations de l'offre d'emploi
            </p>
          </div>

          <Link
            to={`/update-offre/${offre.id}`}
            className="btn-edit"
          >
            Modifier
          </Link>
        </div>

        <div className="patient-infos">
          <div className="info-box">
            <span>ID</span>
            <strong>{offre.id}</strong>
          </div>

          <div className="info-box">
            <span>Titre</span>
            <strong>{offre.titre}</strong>
          </div>

          <div className="info-box">
            <span>Description</span>
            <strong>{offre.description}</strong>
          </div>

          <div className="info-box">
            <span>Localisation</span>
            <strong>{offre.localisation}</strong>
          </div>

          <div className="info-box">
            <span>Type de contrat</span>
            <strong>{offre.typeContrat}</strong>
          </div>

          <div className="info-box">
            <span>Date limite</span>
            <strong>{offre.dateLimite}</strong>
          </div>

          <div className="info-box">
            <span>Recruteur</span>
            <strong>
              {offre.recruteur?.prenom} {offre.recruteur?.nom}
            </strong>
          </div>

          <div className="info-box">
            <span>Email recruteur</span>
            <strong>{offre.recruteur?.email}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsulterOffre;