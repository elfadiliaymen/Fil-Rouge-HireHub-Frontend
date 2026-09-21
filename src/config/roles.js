export const ROLES = ["ADMIN", "RECRUTEUR", "CANDIDAT"];

export const MANAGEMENT_ROLES = ["ADMIN", "RECRUTEUR"];

export const LANDING_ROUTE = {
  ADMIN: "/dashboard",
  RECRUTEUR: "/dashboard",
  CANDIDAT: "/offres",
};

export function getLandingRoute(role) {
  return LANDING_ROUTE[role] || "/auth";
}

/*
 * Matrice de permissions côté produit (section 5).
 * Le frontend peut être volontairement plus strict que le backend :
 * ADMIN ne postule pas et ne dépose pas de CV dans l'UI, même si l'API le permet.
 */
export const CAN = {
  voirOffres: ROLES,
  voirDetailOffre: ROLES,
  postuler: ["CANDIDAT"],
  gererOffres: MANAGEMENT_ROLES,
  voirCandidaturesRecues: MANAGEMENT_ROLES,
  changerStatutCandidature: MANAGEMENT_ROLES,
  voirEntretiens: MANAGEMENT_ROLES,
  gererEntretiens: MANAGEMENT_ROLES,
  gererCv: ["CANDIDAT"],
  voirCandidatures: ["CANDIDAT"],
  gererUsers: ["ADMIN"],
  voirStats: ["ADMIN"],
  voirProfile: ROLES,
};

export function can(role, action) {
  if (!role) return false;
  const allowed = CAN[action];
  return Array.isArray(allowed) && allowed.includes(role);
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
    { label: "Mon CV", path: "/cvs" },
    { label: "Mon profil", path: "/profile" },
  ],
};

export function getMenu(role) {
  return MENU[role] || [];
}