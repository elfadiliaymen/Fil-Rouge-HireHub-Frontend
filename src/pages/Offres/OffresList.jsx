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

  const allTypes = offres.map((offre) => offre.typeContrat);
  const uniqueTypes = allTypes.filter((type, index) => allTypes.indexOf(type) === index);

  const displayedOffres = selectedType !== ""
    ? offres.filter((offre) => offre.typeContrat === selectedType)
    : offres;

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
          {uniqueTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {displayedOffres.length > 0 ? (
        <div className="offres-grid">
          {displayedOffres.map((offre) => (
            <div className="offre-card" key={offre.id}>
              <h2>{offre.titre}</h2>
              <span className="offre-type">{offre.typeContrat}</span>
              <p className="offre-location">{offre.localisation}</p>
              <p className="offre-date">Date limite : {offre.dateLimite}</p>
              <p className="offre-recruiter">
                {offre.recruteur?.prenom} {offre.recruteur?.nom}
              </p>
              <div className="offre-actions">
                <Link className="btn-view" to={`/consulter-offre/${offre.id}`}>
                  Consulter
                </Link>
                <Link className="btn-edit" to={`/update-offre/${offre.id}`}>
                  Modifier
                </Link>
                <button className="btn-delete" onClick={() => handleDelete(offre.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune offre trouvée.</p>
      )}
    </div>
  );
}

export default OffresList;