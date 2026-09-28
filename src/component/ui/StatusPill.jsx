import { STATUT_LABELS, STATUT_ENTRETIEN_LABELS } from "../../utils/constants";

const TONES = {
  EN_ATTENTE: "warn",
  ACCEPTEE: "ok",
  REFUSEE: "danger",
  PLANIFIE: "muted",
  REUSSI: "ok",
  ECHEC: "danger",
  ANNULE: "warn",
};

export default function StatusPill({ status, active, label, tone }) {
  if (label) {
    return <span className={`status-pill status-pill--${tone || "muted"}`}>{label}</span>;
  }

  if (typeof active === "boolean") {
    return active ? (
      <span className="status-pill status-pill--ok">Actif</span>
    ) : (
      <span className="status-pill status-pill--muted">Désactivé</span>
    );
  }

  const toneKey = TONES[status] || "muted";
  return (
    <span className={`status-pill status-pill--${toneKey}`}>
      {STATUT_LABELS[status] || STATUT_ENTRETIEN_LABELS[status] || status}
    </span>
  );
}
