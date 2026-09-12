import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";

function ConsulterCv() {
  const { cvId } = useParams();
  const [cv, setCv] = useState(null);

  useEffect(() => {
    api.get(`/cv/${cvId}`)
      .then((res) => setCv(res.data))
      .catch((err) => console.log(err));
  }, [cvId]);

  if (!cv) {
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
            <h1>Fiche du CV</h1>
            <p>
              Informations du CV
            </p>
          </div>

          <Link
            to={`/update-cv/${cv.id}`}
            className="btn-edit"
          >
            Modifier
          </Link>
        </div>

        <div className="patient-infos">
          <div className="info-box">
            <span>ID</span>
            <strong>{cv.id}</strong>
          </div>

          <div className="info-box">
            <span>Nom du fichier</span>
            <strong>{cv.nomFichier}</strong>
          </div>

          <div className="info-box">
            <span>Chemin du fichier</span>
            <strong>{cv.cheminFichier}</strong>
          </div>

          <div className="info-box">
            <span>Date d'upload</span>
            <strong>{cv.dateUpload}</strong>
          </div>

          <div className="info-box">
            <span>Candidat</span>
            <strong>
              {cv.candidat?.prenom} {cv.candidat?.nom}
            </strong>
          </div>

          <div className="info-box">
            <span>Email candidat</span>
            <strong>{cv.candidat?.email}</strong>
          </div>
        </div>

        <div className="sheet-header">
          <a
            className="btn-primary"
            href={`http://localhost:8090/api/cv/download/${cv.id}`}
            download={cv.nomFichier}
          >
            Télécharger
          </a>
        </div>
      </div>
    </div>
  );
}

export default ConsulterCv;