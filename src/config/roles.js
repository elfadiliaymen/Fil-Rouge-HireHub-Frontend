export const ROLES = ["ADMIN", "RECRUTEUR", "CANDIDAT"];

export const MANAGEMENT_ROLES = ["ADMIN", "RECRUTEUR"];

const LANDING_ROUTE = {
  ADMIN: "/dashboard",
  RECRUTEUR: "/dashboard",
  CANDIDAT: "/offres",
};

export function getLandingRoute(role) {
  return LANDING_ROUTE[role] || "/auth";
}

const MENU = {
  ADMIN: [
    { label: "Tableau de bord", path: "/dashboard" },
    { label: "Utilisateurs", path: "/users" },
    { label: "Offres", path: "/offres" },
    { label: "Candidatures", path: "/candidatures" },
    { label: "Entretiens", path: "/entretiens" },
    { label: "Mon profil", path: "/profile" },
  ],
  RECRUTEUR: [
    { label: "Tableau de bord", path: "/dashboard" },
    { label: "Mes offres", path: "/offres" },
    { label: "Candidatures", path: "/candidatures" },
    { label: "Entretiens", path: "/entretiens" },
    { label: "Mon profil", path: "/profile" },
  ],
  CANDIDAT: [
    { label: "Tableau de bord", path: "/dashboard" },
    { label: "Offres", path: "/offres" },
    { label: "Mes candidatures", path: "/candidatures" },
    { label: "Mes entretiens", path: "/entretiens" },
    { label: "Mon CV", path: "/cvs" },
    { label: "Mon profil", path: "/profile" },
  ],
};

export function getMenu(role) {
  return MENU[role] || [];
}
