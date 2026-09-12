import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

function OffresList() {
  const [offres, setOffres] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    api.get("/offres")
      .then((res) => setOffres(res.data.content))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleDelete(offreId) {
    const confirmed = window.confirm("Voulez-vous supprimer cette offre ?");

    if (!confirmed) {
      return;
    }

    api.delete(`/offres/${offreId}`)
      .then(() => {
        setOffres((currentOffres) =>
          currentOffres.filter((offre) => offre.id !== offreId)
        );
      })
      .catch((error) => {
        console.log(error);
        alert("La suppression a échoué.");
      });
  }

  const allTypes = offres.map((offre) => {
    return offre.typeContrat;
  });

  const uniqueTypes = allTypes.filter((type, index) => {
    return allTypes.indexOf(type) === index;
  });

  let displayedOffres = offres;

  if (selectedType !== "") {
    displayedOffres = offres.filter((offre) => {
      return offre.typeContrat === selectedType;
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Liste des Offres</h1>

        <Link className="btn-primary" to="/add-offre">
          + Ajouter
        </Link>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Tous les types</option>

          {uniqueTypes.map((type, index) => {
            return <option key={index} value={type}>{type}</option>;
          })}
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Type de contrat</th>
              <th>Localisation</th>
              <th>Date limite</th>
              <th>Recruteur</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {offres.length > 0 ? (
              displayedOffres.map((offre) => (
                <tr key={offre.id}>
                  <td>{offre.id}</td>
                  <td>{offre.titre}</td>
                  <td>{offre.typeContrat}</td>
                  <td>{offre.localisation}</td>
                  <td>{offre.dateLimite}</td>
                  <td>
                    {offre.recruteur?.prenom} {offre.recruteur?.nom}
                  </td>

                  <td className="table-actions">
                    <Link
                      className="btn-view"
                      to={`/consulter-offre/${offre.id}`}
                    >
                      Consulter
                    </Link>

                    <Link
                      className="btn-edit"
                      to={`/update-offre/${offre.id}`}
                    >
                      Modifier
                    </Link>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(offre.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  Aucune offre trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OffresList;