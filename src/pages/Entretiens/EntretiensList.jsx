import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

function EntretiensList() {
  const [entretiens, setEntretiens] = useState([]);
  const [selectedRecruteur, setSelectedRecruteur] = useState("");

  useEffect(() => {
    api.get("/entretiens")
      .then((res) => setEntretiens(res.data.content))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleDelete(entretienId) {
    const confirmed = window.confirm("Voulez-vous supprimer cet entretien ?");

    if (!confirmed) {
      return;
    }

    api.delete(`/entretiens/${entretienId}`)
      .then(() => {
        setEntretiens((currentEntretiens) =>
          currentEntretiens.filter((entretien) => entretien.id !== entretienId)
        );
      })
      .catch((error) => {
        console.log(error);
        alert("La suppression a échoué.");
      });
  }

  const allRecruteurs = entretiens.map((entretien) => {
    return entretien.recruteur?.id;
  });

  const uniqueRecruteurs = allRecruteurs.filter((recruteurId, index) => {
    return allRecruteurs.indexOf(recruteurId) === index;
  });

  let displayedEntretiens = entretiens;

  if (selectedRecruteur !== "") {
    displayedEntretiens = entretiens.filter((entretien) => {
      return entretien.recruteur?.id === Number(selectedRecruteur);
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Liste des Entretiens</h1>

        <Link className="btn-primary" to="/add-entretien">
          + Ajouter
        </Link>

        <select
          value={selectedRecruteur}
          onChange={(e) => setSelectedRecruteur(e.target.value)}
        >
          <option value="">Tous les recruteurs</option>

          {uniqueRecruteurs.map((recruteurId, index) => {
            const entretien = entretiens.find(
              (entretien) => entretien.recruteur?.id === recruteurId
            );
            return (
              <option key={index} value={recruteurId}>
                {entretien?.recruteur?.prenom} {entretien?.recruteur?.nom}
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
              <th>Date</th>
              <th>Heure</th>
              <th>Lieu</th>
              <th>Candidature</th>
              <th>Recruteur</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {entretiens.length > 0 ? (
              displayedEntretiens.map((entretien) => (
                <tr key={entretien.id}>
                  <td>{entretien.id}</td>
                  <td>{entretien.date}</td>
                  <td>{entretien.heure}</td>
                  <td>{entretien.lieu}</td>
                  <td>{entretien.candidatureId}</td>
                  <td>
                    {entretien.recruteur?.prenom} {entretien.recruteur?.nom}
                  </td>

                  <td className="table-actions">
                    <Link
                      className="btn-view"
                      to={`/consulter-entretien/${entretien.id}`}
                    >
                      Consulter
                    </Link>

                    <Link
                      className="btn-edit"
                      to={`/update-entretien/${entretien.id}`}
                    >
                      Modifier
                    </Link>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(entretien.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  Aucun entretien trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EntretiensList;