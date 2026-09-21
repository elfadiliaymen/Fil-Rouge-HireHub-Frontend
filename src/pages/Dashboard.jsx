import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../api/api";
import { getApiErrorMessage } from "../api/api";
import { getRole } from "../Components/token";
import { formatDate, isExpiringSoon } from "../utils/format";
import { CONTRAT_LABELS } from "../utils/constants";
import StatCard from "../Components/ui/StatCard";
import StatusPill from "../Components/ui/StatusPill";
import Table from "../Components/ui/Table";
import Skeleton from "../Components/ui/Skeleton";
import ErrorState from "../Components/ui/ErrorState";
import "./Dashboard.css";

export default function Dashboard() {
  const role = getRole();
  const isAdmin = role === "ADMIN";
  const isRecruteur = role === "RECRUTEUR";
  const isManagement = isAdmin || isRecruteur;

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [offresCount, setOffresCount] = useState(0);
  const [candidaturesCount, setCandidaturesCount] = useState(0);
  const [entretiensCount, setEntretiensCount] = useState(0);
  const [mesCandidatures, setMesCandidatures] = useState([]);
  const [cvsCount, setCvsCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const [expiringOffres, setExpiringOffres] = useState([]);

  function load() {
    setStatus("loading");
    setError("");
    setStats(null);

    api
      .get("/offres", { params: { page: 0, size: 50 } })
      .then(function (offresRes) {
        const offres = offresRes.data.content || [];
        setOffresCount(offresRes.data.totalElements ?? offres.length);

        const expiring = offres
          .filter(function (offre) {
            return isExpiringSoon(offre.dateLimite, 7);
          })
          .sort(function (a, b) {
            return new Date(a.dateLimite) - new Date(b.dateLimite);
          })
          .slice(0, 5);
        setExpiringOffres(expiring);

        return api.get("/candidatures", { params: { page: 0, size: 50 } });
      })
      .then(function (candidaturesRes) {
        const candidatures = candidaturesRes.data.content || [];
        setCandidaturesCount(candidaturesRes.data.totalElements ?? candidatures.length);
        setMesCandidatures(candidatures.slice(0, 5));

        if (!isManagement) {
          setEntretiensCount(0);
          return;
        }

        return api
          .get("/entretiens", { params: { page: 0, size: 1 } })
          .then(function (entretiensRes) {
            const entretiens = entretiensRes.data.content || [];
            setEntretiensCount(entretiensRes.data.totalElements ?? entretiens.length);
          })
          .catch(function () {
            setEntretiensCount(0);
          });
      })
      .then(function () {
        if (!isAdmin) return;

        return api.get("/users/stats").then(function (statsRes) {
          setStats(statsRes.data);
        });
      })
      .then(function () {
        if (!isAdmin) return;

        return api.get("/users", { params: { page: 0, size: 5 } }).then(function (usersRes) {
          setRecentUsers(usersRes.data.content || []);
        });
      })
      .then(function () {
        if (role !== "CANDIDAT") return;

        return api.get("/cv").then(function (cvsRes) {
          setCvsCount(cvsRes.data.totalElements ?? (cvsRes.data.content || []).length);
        });
      })
      .then(function () {
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, [isAdmin, isManagement, role]);

  const candidatCounts = {
    EN_ATTENTE: mesCandidatures.filter((c) => c.statut === "EN_ATTENTE").length,
    ACCEPTEE: mesCandidatures.filter((c) => c.statut === "ACCEPTEE").length,
    REFUSEE: mesCandidatures.filter((c) => c.statut === "REFUSEE").length,
  };

  if (status === "loading") {
    return <Skeleton lines={8} />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <div className="dashboard-page">
      <div className="page-head">
        <div>
          <h1>Tableau de bord</h1>
          <p className="text-muted">
            {isAdmin
              ? "Vue d'ensemble de la plateforme."
              : isRecruteur
                ? "Suivi de vos offres et candidatures."
                : "Suivi de vos candidatures."}
          </p>
        </div>
      </div>

      {isAdmin && stats && (
        <>
          <div className="stats-grid">
            <StatCard label="Utilisateurs" value={stats.total} />
            <StatCard label="Comptes actifs" value={stats.actifs} />
            <StatCard label="Recruteurs" value={stats.recruteurs} />
            <StatCard label="Candidats" value={stats.candidats} />
            <StatCard label="Administrateurs" value={stats.administrateurs} />
          </div>

          <div className="stats-grid">
            <StatCard label="Offres publiées" value={offresCount} />
            <StatCard label="Candidatures reçues" value={candidaturesCount} />
            <StatCard label="Entretiens planifiés" value={entretiensCount} />
          </div>
        </>
      )}

      {isRecruteur && (
        <div className="stats-grid">
          <StatCard label="Offres publiées" value={offresCount} />
          <StatCard label="Candidatures reçues" value={candidaturesCount} />
          <StatCard label="Entretiens planifiés" value={entretiensCount} />
        </div>
      )}

      {role === "CANDIDAT" && (
        <div className="stats-grid">
          <StatCard label="Mes candidatures" value={candidaturesCount} />
          <StatCard label="En attente" value={candidatCounts.EN_ATTENTE} />
          <StatCard label="Acceptées" value={candidatCounts.ACCEPTEE} />
          <StatCard label="Refusées" value={candidatCounts.REFUSEE} />
          <StatCard label="Mes CV" value={cvsCount} />
        </div>
      )}

      <div className="dashboard-grid">
        {isAdmin && recentUsers.length > 0 && (
          <section className="dashboard-section">
            <div className="section-head">
              <h2 className="section-title">Derniers utilisateurs</h2>
              <Link to="/users" className="btn btn-secondary btn-sm">
                Tout voir
              </Link>
            </div>
            <Table
              columns={[
                { key: "name", label: "Nom" },
                { key: "email", label: "Email" },
                { key: "role", label: "Rôle" },
                { key: "actions", label: "", className: "table-actions-col" },
              ]}
            >
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link to={`/consulter-user/${user.id}`} className="table-link">
                      {user.prenom} {user.nom}
                    </Link>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="table-actions-col">
                    <Link
                      to={`/consulter-user/${user.id}`}
                      className="btn btn-secondary btn-sm btn-icon"
                      title="Détail"
                      aria-label="Voir le détail de l'utilisateur"
                    >
                      <VisibilityIcon />
                    </Link>
                  </td>
                </tr>
              ))}
            </Table>
          </section>
        )}

        {(isAdmin || isRecruteur) && (
          <section className="dashboard-section">
            <div className="section-head">
              <h2 className="section-title">Offres expirant bientôt</h2>
              <Link to="/offres" className="btn btn-secondary btn-sm">
                Toutes
              </Link>
            </div>
            {expiringOffres.length === 0 ? (
              <p className="text-muted">Aucune offre proche de l'échéance.</p>
            ) : (
              <div className="row-list">
                {expiringOffres.map((offre) => (
                  <Link
                    key={offre.id}
                    to={`/consulter-offre/${offre.id}`}
                    className="row-list-item"
                  >
                    <div>
                      <strong>{offre.titre}</strong>
                      <span className="text-muted text-sm">
                        {CONTRAT_LABELS[offre.typeContrat] || offre.typeContrat} ·{" "}
                        {offre.localisation}
                      </span>
                    </div>
                    <span className="deadline">Limite : {formatDate(offre.dateLimite)}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {(isAdmin || isRecruteur) && (
          <section className="dashboard-section">
            <div className="section-head">
              <h2 className="section-title">Dernières candidatures</h2>
              <Link to="/candidatures" className="btn btn-secondary btn-sm">
                Toutes
              </Link>
            </div>
            {mesCandidatures.length === 0 ? (
              <p className="text-muted">Aucune candidature reçue.</p>
            ) : (
              <div className="row-list">
                {mesCandidatures.map((candidature) => (
                  <div key={candidature.id} className="row-list-item">
                    <div>
                      <strong>
                        {candidature.candidat?.prenom} {candidature.candidat?.nom}
                      </strong>
                      <span className="text-muted text-sm">
                        {candidature.offre?.titre || "Offre #" + candidature.offre?.id}
                      </span>
                    </div>
                    <StatusPill status={candidature.statut} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {role === "CANDIDAT" && (
          <section className="dashboard-section">
            <div className="section-head">
              <h2 className="section-title">Mes dernières candidatures</h2>
              <Link to="/candidatures" className="btn btn-secondary btn-sm">
                Tout voir
              </Link>
            </div>
            {mesCandidatures.length === 0 ? (
              <p className="text-muted">Aucune candidature pour le moment.</p>
            ) : (
              <div className="row-list">
                {mesCandidatures.map((candidature) => (
                  <Link
                    key={candidature.id}
                    to={`/consulter-candidature/${candidature.id}`}
                    className="row-list-item"
                  >
                    <div>
                      <strong>{candidature.offre?.titre || "—"}</strong>
                      <span className="text-muted text-sm">
                        Postulé le {formatDate(candidature.dateCandidature)}
                      </span>
                    </div>
                    <StatusPill status={candidature.statut} />
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}