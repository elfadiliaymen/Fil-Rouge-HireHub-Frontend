import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

function CandidaturesList() {
  const [candidatures, setCandidatures] = useState([]);
  const [selectedStatut, setSelectedStatut] = useState("");

  useEffect(() => {
    api.get("/candidatures")
      .then((res) => setCandidatures(res.data.content))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleDelete(candidatureId) {
    const confirmed = window.confirm("Voulez-vous supprimer cette candidature ?");

    if (!confirmed) {
      return;
    }

    api.delete(`/candidatures/${candidatureId}`)
      .then(() => {
        setCandidatures((currentCandidatures) =>
          currentCandidatures.filter((candidature) => candidature.id !== candidatureId)
        );
      })
      .catch((error) => {
        console.log(error);
        alert("La suppression a échoué.");
      });
  }

  const allStatuts = candidatures.map((candidature) => {
    return candidature.statut;
  });

  const uniqueStatuts = allStatuts.filter((statut, index) => {
    return allStatuts.indexOf(statut) === index;
  });

  let displayedCandidatures = candidatures;

  if (selectedStatut !== "") {
    displayedCandidatures = candidatures.filter((candidature) => {
      return candidature.statut === selectedStatut;
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Liste des Candidatures</h1>

        <Link className="btn-primary" to="/add-candidature">
          + Ajouter
        </Link>

        <select
          value={selectedStatut}
          onChange={(e) => setSelectedStatut(e.target.value)}
        >
          <option value="">Tous les statuts</option>

          {uniqueStatuts.map((statut, index) => {
            return <option key={index} value={statut}>{statut}</option>;
          })}
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Candidat</th>
              <th>Offre</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {candidatures.length > 0 ? (
              displayedCandidatures.map((candidature) => (
                <tr key={candidature.id}>
                  <td>{candidature.id}</td>
                  <td>{candidature.dateCandidature}</td>
                  <td>{candidature.statut}</td>
                  <td>
                    {candidature.candidat?.prenom} {candidature.candidat?.nom}
                  </td>
                  <td>{candidature.offre?.titre}</td>

                  <td className="table-actions">
                    <Link
                      className="btn-view"
                      to={`/consulter-candidature/${candidature.id}`}
                    >
                      Consulter
                    </Link>

                    <Link
                      className="btn-edit"
                      to={`/update-candidature/${candidature.id}`}
                    >
                      Modifier
                    </Link>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(candidature.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  Aucune candidature trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CandidaturesList;