import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";

function ConsulterUser() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get(`/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, [userId]);

  if (!user) {
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
            <h1>Fiche de l'Utilisateur</h1>
            <p>
              Informations de l'utilisateur
            </p>
          </div>

          <Link
            to={`/update-user/${user.id}`}
            className="btn-edit"
          >
            Modifier
          </Link>
        </div>

        <div className="patient-infos">
          <div className="info-box">
            <span>ID</span>
            <strong>{user.id}</strong>
          </div>

          <div className="info-box">
            <span>Nom</span>
            <strong>{user.nom}</strong>
          </div>

          <div className="info-box">
            <span>Prénom</span>
            <strong>{user.prenom}</strong>
          </div>

          <div className="info-box">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="info-box">
            <span>Rôle</span>
            <strong>{user.role}</strong>
          </div>

          <div className="info-box">
            <span>Actif</span>
            <strong>{user.active ? "Oui" : "Non"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsulterUser;