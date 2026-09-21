import { Link } from "react-router-dom";
import "./Landing.css";

const STATS = [
  { value: "120+", label: "Offres actives" },
  { value: "3 200", label: "Candidats" },
  { value: "45", label: "Entreprises" },
  { value: "890", label: "Embauches réalisées" },
];

const ROLES = [
  {
    title: "Candidat",
    points: ["Déposez votre CV", "Postulez en un clic", "Suivez vos candidatures"],
    cta: "Créer un compte candidat",
    to: "/auth?mode=register&role=CANDIDAT",
  },
  {
    title: "Recruteur",
    points: ["Publiez vos offres", "Recevez les candidatures", "Planifiez les entretiens"],
    cta: "Créer un compte recruteur",
    to: "/auth?mode=register&role=RECRUTEUR",
  },
  {
    title: "Administrateur",
    points: ["Supervisez la plateforme", "Gérez les utilisateurs", "Suivez les statistiques"],
    cta: "Espace administrateur",
    to: "/auth",
  },
];

const FEATURES = [
  {
    title: "Dépôt de CV",
    text: "Joignez votre CV à votre profil en quelques secondes et postulez aux offres qui vous correspondent.",
  },
  {
    title: "Suivi des candidatures",
    text: "Suivez l'état de chaque candidature : en attente, acceptée ou refusée.",
  },
  {
    title: "Tableaux de bord",
    text: "Un espace personnel adapté à votre rôle avec les informations essentielles.",
  },
  {
    title: "Entretiens",
    text: "Les recruteurs organisent et lient les entretiens aux candidatures retenues.",
  },
];

export default function Landing() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="container landing-hero-inner">
          <h1>Le recrutement, simplifié.</h1>
          <p className="landing-hero-sub">
            Candidats, recruteurs et administrateurs au même endroit : déposez votre CV,
            publiez des offres et suivez chaque candidature jusqu'à l'embauche.
          </p>
          <div className="landing-hero-actions">
            <Link to="/jobs" className="btn btn-primary btn-lg">
              Voir les offres
            </Link>
            <Link to="/auth?mode=register" className="btn btn-primary btn-lg">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-stats" aria-label="Quelques chiffres">
        <div className="container landing-stats-inner">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-item">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="container">
          <h2 className="section-title">Conçu pour chaque acteur</h2>
          <div className="landing-roles">
            {ROLES.map((role) => (
              <article key={role.title} className="role-card">
                <h3>{role.title}</h3>
                <ul>
                  {role.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <Link to={role.to}>{role.cta} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-alt">
        <div className="container">
          <h2 className="section-title">Fonctionnalités clés</h2>
          <div className="landing-features">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="feature-item">
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2 className="section-title">Prêt à démarrer ?</h2>
          <p>Rejoignez HireHub dès maintenant, c'est gratuit.</p>
          <div className="btn-group">
            <Link to="/auth?mode=register" className="btn btn-primary btn-lg">
              S'inscrire
            </Link>
            <Link to="/jobs" className="btn btn-secondary btn-lg">
              Voir les offres
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}