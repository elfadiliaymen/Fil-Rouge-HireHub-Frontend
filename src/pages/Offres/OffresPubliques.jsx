import JobCard from "../../component/ui/JobCard";
import SearchBar from "../../component/ui/SearchBar";
import FilterPanel from "../../component/ui/FilterPanel";
import Select from "../../component/ui/Select";
import ActiveFilterChips from "../../component/ui/ActiveFilterChips";
import Pagination from "../../component/ui/Pagination";
import Skeleton from "../../component/ui/Skeleton";
import EmptyState from "../../component/ui/EmptyState";
import ErrorState from "../../component/ui/ErrorState";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { CONTRAT_LABELS, CONTRAT_VALUES } from "../../utils/constants";
import { useState, useEffect } from "react";

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

function toBackendSort(sort) {
  return sort === "deadline" ? "dateLimite,asc" : "datePublication,desc";
}

export default function OffresPubliques() {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [offres, setOffres] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(getQueryParam("search"));
  const [type, setType] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  function load() {
    setStatus("loading");
    setError("");

    const params = {
      page,
      size,
      sort: toBackendSort(sort),
    };

    const needle = search.trim();
    if (needle) params.q = needle;
    if (type) params.type = type;

    api
      .get("/offres", { params })
      .then(function (response) {
        setOffres(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
        setPage(response.data.number !== undefined ? response.data.number : page);
        setSize(response.data.size || size);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, [search, type, sort, page, size]);

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

  function handleSizeChange(next) {
    setSize(next);
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

  return (
    <div className="jobs-page container">
      <div className="jobs-header">
        <h1>Offres d'emploi</h1>
        <p className="text-muted">
          Découvrez les opportunités publiées sur HireHub.
        </p>
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
              id="jobs-type"
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
              id="jobs-sort"
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

      {status === "loading" && (
        <div className="jobs-grid" aria-live="polite">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} lines={4} />
          ))}
        </div>
      )}

      {status === "error" && <ErrorState message={error} onRetry={load} />}

      {status === "success" && offres.length === 0 && (
        <EmptyState
          title="Aucune offre trouvée"
          message="Modifiez votre recherche ou vos filtres pour voir plus d'offres."
          action={
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
              Réinitialiser les filtres
            </button>
          }
        />
      )}

      {status === "success" && offres.length > 0 && (
        <>
          <div className="jobs-grid">
            {offres.map((offre) => (
              <JobCard key={offre.id} offre={offre} />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            size={size}
            onPageChange={setPage}
            onSizeChange={handleSizeChange}
          />
        </>
      )}
    </div>
  );
}
