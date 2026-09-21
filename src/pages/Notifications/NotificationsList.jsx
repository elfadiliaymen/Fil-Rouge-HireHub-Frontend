import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { formatDateTime } from "../../utils/format";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import EmptyState from "../../Components/ui/EmptyState";
import Button from "../../Components/ui/Button";
import "./Notifications.css";

const TYPE_LABELS = {
  CANDIDATURE_SOUMISE: "Soumise",
  CANDIDATURE_CONSULTEE: "Consultée",
  CANDIDATURE_EN_ATTENTE: "En attente",
  CANDIDATURE_ACCEPTEE: "Acceptée",
  CANDIDATURE_REFUSEE: "Refusée",
};

const TYPE_CLASS = {
  CANDIDATURE_SOUMISE: "type-soumise",
  CANDIDATURE_CONSULTEE: "type-consultee",
  CANDIDATURE_EN_ATTENTE: "type-attente",
  CANDIDATURE_ACCEPTEE: "type-acceptee",
  CANDIDATURE_REFUSEE: "type-refusee",
};

export default function NotificationsList() {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  function load() {
    setStatus("loading");
    setError("");

    api
      .get("/notifications", { params: { page: 0, size: 50 } })
      .then(function (response) {
        setNotifications(response.data.content || []);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, []);

  const unreadCount = notifications.filter(function (n) {
    return !n.lu;
  }).length;

  function handleMettreLue(id) {
    setProcessingId(id);
    api
      .patch("/notifications/" + id + "/lue")
      .then(function () {
        setNotifications(function (current) {
          return current.map(function (n) {
            return n.id === id ? { ...n, lu: true } : n;
          });
        });
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La mise à jour a échoué."));
      })
      .finally(function () {
        setProcessingId(null);
      });
  }

  function handleToutLire() {
    setMarkingAll(true);
    api
      .patch("/notifications/lues")
      .then(function () {
        setNotifications(function (current) {
          return current.map(function (n) {
            return { ...n, lu: true };
          });
        });
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La mise à jour a échoué."));
      })
      .finally(function () {
        setMarkingAll(false);
      });
  }

  return (
    <div className="notifications-page">
      <div className="page-head">
        <div>
          <h1>Notifications</h1>
          <p className="text-muted">Suivez l'évolution de vos candidatures.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={handleToutLire} disabled={markingAll}>
            {markingAll ? "Mise à jour…" : "Tout marquer comme lu"}
          </Button>
        )}
      </div>

      {status === "loading" && <Skeleton lines={6} />}

      {status === "error" && <ErrorState message={error} onRetry={load} />}

      {status === "success" && notifications.length === 0 && (
        <EmptyState
          title="Aucune notification"
          message="Vous serez notifié dès que votre candidature change de statut."
        />
      )}

      {status === "success" && notifications.length > 0 && (
        <div className="notifications-list">
          {notifications.map(function (notification) {
            const typeClass = TYPE_CLASS[notification.type] || "";
            const isUnread = !notification.lu;

            return (
              <article
                key={notification.id}
                className={"notification-item" + (isUnread ? " is-unread" : "")}
              >
                <div className="notification-main">
                  <span className={"notification-type " + typeClass}>
                    {TYPE_LABELS[notification.type] || notification.type}
                  </span>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-date">
                    {formatDateTime(notification.dateCreation)}
                  </span>
                </div>

                <div className="notification-actions">
                  {notification.candidatureId && (
                    <Link
                      to={`/consulter-candidature/${notification.candidatureId}`}
                      className="btn btn-secondary btn-sm"
                    >
                      Voir la candidature
                    </Link>
                  )}
                  {isUnread && (
                    <Button
                      variant="subtle"
                      size="sm"
                      disabled={processingId === notification.id}
                      onClick={() => handleMettreLue(notification.id)}
                    >
                      Marquer lu
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}