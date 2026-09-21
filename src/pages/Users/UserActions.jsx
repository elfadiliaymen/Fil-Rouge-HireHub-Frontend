import { Link } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DashboardIcon from "@mui/icons-material/Dashboard";

const ACTIONS = [
  {
    to: "/users",
    title: "Liste des utilisateurs",
    text: "Afficher et gérer tous les comptes.",
    icon: PeopleIcon,
  },
  {
    to: "/add-user",
    title: "Nouvel utilisateur",
    text: "Créer un compte (admin, recruteur, candidat).",
    icon: PersonAddIcon,
  },
  {
    to: "/dashboard",
    title: "Tableau de bord",
    text: "Voir les statistiques de la plateforme.",
    icon: DashboardIcon,
  },
];

export default function UserActions() {
  return (
    <div className="actions-page">
      <div className="page-head">
        <div>
          <h1>Gestion des utilisateurs</h1>
          <p className="text-muted">Choisissez une opération.</p>
        </div>
      </div>

      <div className="actions-grid">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.to} to={action.to} className="action-card">
              <Icon className="action-card-icon" />
              <h2>{action.title}</h2>
              <p>{action.text}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}