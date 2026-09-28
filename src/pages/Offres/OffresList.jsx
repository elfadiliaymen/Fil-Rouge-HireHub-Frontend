import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getRole, getUserId } from "../../component/token";
import { CONTRAT_LABELS, CONTRAT_VALUES } from "../../utils/constants";
import JobCard from "../../component/ui/JobCard";
import SearchBar from "../../component/ui/SearchBar";
import FilterPanel from "../../component/ui/FilterPanel";
import Select from "../../component/ui/Select";
import ActiveFilterChips from "../../component/ui/ActiveFilterChips";
import Skeleton from "../../component/ui/Skeleton";
import ErrorState from "../../component/ui/ErrorState";
import EmptyState from "../../component/ui/EmptyState";
import Pagination from "../../component/ui/Pagination";
import ConfirmDialog from "../../component/ui/ConfirmDialog";
import Button from "../../component/ui/Button";

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

function toBackendSort(sort) {
  return sort === "deadline" ? "dateLimite,asc" : "datePublication,desc";
}

export default function OffresList() {
  const role = getRole();
  const userId = getUserId();
  const isManagement = role === "ADMIN" || role === "RECRUTEUR";
  const isAdmin = role === "ADMIN";
  const isRecruiterList = role === "RECRUTEUR" && Boolean(userId);

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [offres, setOffres] = useState([]);
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const [search, setSearch] = useState(getQueryParam("search"));
  const [type, setType] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function canManageOffre(offre) {
    return isAdmin || Number(offre.recruteurId) === Number(userId);
  }

  const load = useCallback(
    function () {
      setStatus("loading");
      setError("");

      const request = isRecruiterList
        ? api.get("/offres/recruteur/" + userId, { params: { page: 0, size: 50 } })
        : (function () {
            const params = {
              page,
              size,
              sort: toBackendSort(sort),
            };

            const needle = search.trim();
            if (needle) params.q = needle;
            if (type) params.type = type;

            return api.get("/offres", { params });
          })();

      request
        .then(function (response) {
          setOffres(response.data.content || []);
          setServerTotalPages(response.data.totalPages || 1);
          setPage(response.data.number !== undefined ? response.data.number : page);
          setSize(response.data.size || size);
          setStatus("success");
        })
        .catch(function (reason) {
          setError(getApiErrorMessage(reason));
          setStatus("error");
        });
    },
    [isRecruiterList, userId, search, type, sort, page, size]
  );

  useEffect(
    function () {
      if (!isRecruiterList) {
        load();
      }
    },
    [load, isRecruiterList]
  );

  useEffect(
    function () {
      if (isRecruiterList) {
        load();
      }
    },
    [load, isRecruiterList]
  );

  let currentTotalPages = serverTotalPages;
  let currentPage = page;
  let visible = offres;

  if (isRecruiterList) {
    let filtered = type
      ? offres.filter((offre) => offre.typeContrat === type)
      : offres;

    const needle = search.trim().toLowerCase();
    if (needle) {
      filtered = filtered.filter((offre) =>
        [offre.titre, offre.localisation, offre.description].some((value) =>
          (value || "").toLowerCase().includes(needle)
        )
      );
    }

    const sorted = [...filtered];

    if (sort === "deadline") {
      sorted.sort(
        (a, b) =>
          new Date(a.dateLimite || 0).getTime() - new Date(b.dateLimite || 0).getTime()
      );
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.dateLimite || 0).getTime() - new Date(a.dateLimite || 0).getTime()
      );
    }

    currentTotalPages = Math.max(1, Math.ceil(sorted.length / size));
    currentPage = Math.min(page, currentTotalPages - 1);
    visible = sorted.slice(currentPage * size, currentPage * size + size);
  }

  function handleSearchChange(next) {
    setSearch(next);
    setPage(0);
  }

  function handleTypeChange(next) {
    setType(next);
    setPage(0);
  }

  function handleSortChange(next) {
    setSort(next);
    setPage(0);
  }

  function clearFilters() {
    setSearch("");
    setType("");
    setSort("recent");
    setPage(0);
  }

  function removeFilter(key) {
    if (key === "search") setSearch("");
    if (key === "type") setType("");
    setPage(0);
  }

  const activeFilters = [
    ...(search.trim() ? [{ key: "search", label: `Recherche : « ${search.trim()} »` }] : []),
    ...(type ? [{ key: "type", label: `Contrat : ${CONTRAT_LABELS[type] || type}` }] : []),
  ];

  const hasFilters = activeFilters.length > 0;

  function handleDelete() {
    if (!toDelete) return;

    setDeleting(true);
    api
      .delete("/offres/" + toDelete.id)
      .then(function () {
        setOffres((current) => current.filter((offre) => offre.id !== toDelete.id));
        toast.success("Offre supprimée");
        setToDelete(null);
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La suppression a échoué."));
      })
      .finally(function () {
        setDeleting(false);
      });
  }

  return (
    <div className="offres-list-page">
      <div className="page-head">
        <div>
          <h1>{isManagement ? "Offres d'emploi" : "Offres"}</h1>
          <p className="text-muted">
            {isManagement
              ? "Publiez, modifiez et suivez vos offres."
              : "Consultez les offres disponibles."}
          </p>
        </div>

        {isManagement && (
          <Link to="/add-offre" className="btn btn-primary">
            <AddIcon /> Nouvelle offre
          </Link>
        )}
      </div>

      <div className="jobs-toolbar">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder="Rechercher un poste, une localisation…"
          name="recherche-offres"
        />

        <FilterPanel title="Filtres">
          <div className="jobs-filters">
            <Select
              id="offres-type"
              label="Type de contrat"
              value={type}
              onChange={(event) => handleTypeChange(event.target.value)}
            >
              <option value="">Tous</option>
              {CONTRAT_VALUES.map((value) => (
                <option key={value} value={value}>
                  {CONTRAT_LABELS[value]}
                </option>
              ))}
            </Select>

            <Select
              id="offres-sort"
              label="Tri"
              value={sort}
              onChange={(event) => handleSortChange(event.target.value)}
            >
              <option value="recent">Plus récentes</option>
              <option value="deadline">Limite la plus proche</option>
            </Select>
          </div>
        </FilterPanel>
      </div>

      <ActiveFilterChips
        filters={activeFilters}
        onRemove={removeFilter}
        onClear={clearFilters}
      />

      {status === "loading" && <Skeleton lines={5} />}

      {status === "error" && <ErrorState message={error} onRetry={load} />}

      {status === "success" && visible.length === 0 && (
        <EmptyState
          title={isManagement ? "Aucune offre" : "Aucune offre trouvée"}
          message={
            isManagement
              ? "Créez votre première offre pour recevoir des candidatures."
              : "Modifiez votre recherche ou vos filtres pour voir plus de résultat."
          }
          action={
            isManagement ? (
              <Link to="/add-offre" className="btn btn-primary">
                Nouvelle offre
              </Link>
            ) : hasFilters ? (
              <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                Réinitialiser les filtres
              </button>
            ) : (
              <Link to="/jobs" className="btn btn-secondary">
                Voir les offres
              </Link>
            )
          }
        />
      )}

      {status === "success" && visible.length > 0 && (
        <>
          <div className="offres-grid">
            {visible.map((offre) =>
              canManageOffre(offre) ? (
                <JobCard
                  key={offre.id}
                  offre={offre}
                  to={`/consulter-offre/${offre.id}`}
                  cta={false}
                  actions={
                    <>
                      <Link
                        to={`/consulter-offre/${offre.id}`}
                        className="btn btn-secondary btn-sm btn-icon"
                        title="Consulter"
                        aria-label="Consulter l'offre"
                      >
                        <VisibilityIcon />
                      </Link>
                      <Link
                        to={`/update-offre/${offre.id}`}
                        className="btn btn-secondary btn-sm btn-icon"
                        title="Modifier"
                        aria-label="Modifier l'offre"
                      >
                        <EditIcon />
                      </Link>
                      <Button
                        variant="danger-solid"
                        size="sm"
                        className="btn-icon"
                        title="Supprimer"
                        aria-label="Supprimer l'offre"
                        onClick={() => setToDelete(offre)}
                      >
                        <DeleteIcon />
                      </Button>
                    </>
                  }
                />
              ) : (
                <JobCard
                  key={offre.id}
                  offre={offre}
                  to={`/consulter-offre/${offre.id}`}
                  actionLabel="Consulter"
                />
              )
            )}
          </div>

          <Pagination
            page={currentPage}
            totalPages={currentTotalPages}
            size={size}
            onPageChange={setPage}
            onSizeChange={(next) => {
              setSize(next);
              setPage(0);
            }}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer l'offre"
        message={`Voulez-vous vraiment supprimer l'offre « ${toDelete?.titre || ""} » ?`}
        confirmLabel="Supprimer"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
