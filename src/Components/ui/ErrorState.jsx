import Button from "./Button";
import "./ErrorState.css";

export default function ErrorState({ message = "Une erreur est survenue.", onRetry }) {
  return (
    <div className="error-state" role="alert">
      <h3>Une erreur est survenue</h3>
      <p>{message}</p>
      {onRetry && (
        <div className="error-state-action">
          <Button variant="secondary" onClick={onRetry}>
            Réessayer
          </Button>
        </div>
      )}
    </div>
  );
}