import { STATUT_LABELS } from "../../utils/constants";
import "./StatusPill.css";

const TONES = {
  EN_ATTENTE: "warn",
  ACCEPTEE: "ok",
  REFUSEE: "danger",
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
      {STATUT_LABELS[status] || status}
    </span>
  );
}