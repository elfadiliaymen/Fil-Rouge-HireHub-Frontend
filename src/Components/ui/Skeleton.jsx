import "./Skeleton.css";

export default function Skeleton({ lines = 3 }) {
  return (
    <div className="skeleton" role="status" aria-label="Chargement en cours">
      {Array.from({ length: lines }, (_, index) => (
        <span key={index} className="skeleton-line" />
      ))}
    </div>
  );
}