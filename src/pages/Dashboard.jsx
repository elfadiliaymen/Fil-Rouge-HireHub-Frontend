import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de Bord</h1>
        <p>
          Sélectionnez un module pour gérer les données de la plateforme.
        </p>
      </div>

      <div className="dashboard-grid">
        <Link className="dashboard-card" to="/users-actions">
          <h2>Utilisateurs</h2>
          <p>Gérer les candidats, recruteurs et administrateurs.</p>
        </Link>

        <Link className="dashboard-card" to="/cvs-actions">
          <h2>CV</h2>
          <p>Ajouter, modifier, consulter et supprimer les CV.</p>
        </Link>

        <Link className="dashboard-card" to="/candidatures-actions">
          <h2>Candidatures</h2>
          <p>Suivre les candidatures et leurs statuts.</p>
        </Link>

        <Link className="dashboard-card" to="/offres-actions">
          <h2>Offres d'Emploi</h2>
          <p>Publier et gérer les offres d'emploi.</p>
        </Link>

        <Link className="dashboard-card" to="/entretiens-actions">
          <h2>Entretiens</h2>
          <p>Planifier et gérer les entretiens.</p>
        </Link>
      </div>
    </main>
  );
}

export default Dashboard;