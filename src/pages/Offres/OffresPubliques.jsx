import JobCard from "../../Components/ui/JobCard";
import SearchBar from "../../Components/ui/SearchBar";
import FilterPanel from "../../Components/ui/FilterPanel";
import Select from "../../Components/ui/Select";
import ActiveFilterChips from "../../Components/ui/ActiveFilterChips";
import Pagination from "../../Components/ui/Pagination";
import Skeleton from "../../Components/ui/Skeleton";
import EmptyState from "../../Components/ui/EmptyState";
import ErrorState from "../../Components/ui/ErrorState";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { CONTRAT_LABELS, CONTRAT_VALUES } from "../../utils/constants";
import { useState, useEffect } from "react";
import "./Offres.css";

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

export default function OffresPubliques() {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [offres, setOffres] = useState([]);
  const [search, setSearch] = useState(getQueryParam("search"));
  const [type, setType] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  function load() {
    setStatus("loading");
    setError("");

    const request = type ? api.get("/offres/type/" + type) : api.get("/offres");

    request
      .then(function (response) {
        setOffres(response.data.content || []);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, [type]);

  let filtered = offres;

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
      (a, b) => new Date(a.dateLimite || 0).getTime() - new Date(b.dateLimite || 0).getTime()
    );
  } else {
    sorted.sort(
      (a, b) => new Date(b.dateLimite || 0).getTime() - new Date(a.dateLimite || 0).getTime()
    );
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / size));
  const currentPage = Math.min(page, totalPages - 1);
  const visible = sorted.slice(currentPage * size, currentPage * size + size);

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

      {status === "success" && visible.length === 0 && (
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

      {status === "success" && visible.length > 0 && (
        <>
          <div className="jobs-grid">
            {visible.map((offre) => (
              <JobCard key={offre.id} offre={offre} />
            ))}
          </div>

          <Pagination
            page={currentPage}
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