import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

function CvsList() {
  const [cvs, setCvs] = useState([]);
  const [selectedCandidat, setSelectedCandidat] = useState("");

  useEffect(() => {
    api.get("/cv")
      .then((res) => setCvs(res.data.content))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleDelete(cvId) {
    const confirmed = window.confirm("Voulez-vous supprimer ce CV ?");

    if (!confirmed) {
      return;
    }

    api.delete(`/cv/${cvId}`)
      .then(() => {
        setCvs((currentCvs) =>
          currentCvs.filter((cv) => cv.id !== cvId)
        );
      })
      .catch((error) => {
        console.log(error);
        alert("La suppression a échoué.");
      });
  }

  const allCandidats = cvs.map((cv) => {
    return cv.candidat?.id;
  });

  const uniqueCandidats = allCandidats.filter((candidatId, index) => {
    return allCandidats.indexOf(candidatId) === index;
  });

  let displayedCvs = cvs;

  if (selectedCandidat !== "") {
    displayedCvs = cvs.filter((cv) => {
      return cv.candidat?.id === Number(selectedCandidat);
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Liste des CV</h1>

        <Link className="btn-primary" to="/add-cv">
          + Ajouter
        </Link>

        <select
          value={selectedCandidat}
          onChange={(e) => setSelectedCandidat(e.target.value)}
        >
          <option value="">Tous les candidats</option>

          {uniqueCandidats.map((candidatId, index) => {
            const candidat = cvs.find((cv) => cv.candidat?.id === candidatId);
            return (
              <option key={index} value={candidatId}>
                {candidat?.candidat?.prenom} {candidat?.candidat?.nom}
              </option>
            );
          })}
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom du fichier</th>
              <th>Date d'upload</th>
              <th>Candidat</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {cvs.length > 0 ? (
              displayedCvs.map((cv) => (
                <tr key={cv.id}>
                  <td>{cv.id}</td>
                  <td>{cv.nomFichier}</td>
                  <td>{cv.dateUpload}</td>
                  <td>
                    {cv.candidat?.prenom} {cv.candidat?.nom}
                  </td>

                  <td className="table-actions">
                    <Link
                      className="btn-view"
                      to={`/consulter-cv/${cv.id}`}
                    >
                      Consulter
                    </Link>

                    <Link
                      className="btn-edit"
                      to={`/update-cv/${cv.id}`}
                    >
                      Modifier
                    </Link>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(cv.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  Aucun CV trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CvsList;