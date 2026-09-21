import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CONTRAT_LABELS } from "../../utils/constants";
import { formatDate, isExpiringSoon } from "../../utils/format";
import "./JobCard.css";

export default function JobCard({ offre, to, cta = true, actionLabel = "Consulter", actions = null }) {
  const expiringSoon = isExpiringSoon(offre.dateLimite, 3);
  const recruteur = offre.recruteur
    ? `${offre.recruteur.prenom} ${offre.recruteur.nom}`
    : null;
  const linkTo = to || `/jobs/${offre.id}`;

  return (
    <article className="job-card">
      <span className="status-pill status-pill--accent job-card-type">
        {CONTRAT_LABELS[offre.typeContrat] || offre.typeContrat}
      </span>

      <h3 className="job-card-title">{offre.titre}</h3>

      <p className="job-card-meta">
        {offre.localisation}
        {recruteur && <> · {recruteur}</>}
      </p>

      <p className="job-card-deadline">
        Limite : {formatDate(offre.dateLimite)}
        {expiringSoon && <span className="job-card-urgent">Expire bientôt</span>}
      </p>

      {cta && (
        <Link
          to={linkTo}
          className="btn btn-secondary btn-icon job-card-cta"
          title={actionLabel}
          aria-label={actionLabel}
        >
          <VisibilityIcon />
        </Link>
      )}

      {actions && <div className="job-card-actions">{actions}</div>}
    </article>
  );
}