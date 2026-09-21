import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { candidatureFormSchema } from "../../utils/schemas/candidatureSchema";
import Select from "../../Components/ui/Select";
import Button from "../../Components/ui/Button";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import "./Candidatures.css";

export default function AddCandidature() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [candidats, setCandidats] = useState([]);
  const [offres, setOffres] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(candidatureFormSchema),
    defaultValues: {
      candidatId: "",
      offreId: "",
    },
  });

  useEffect(() => {
    api
      .get("/users/role/CANDIDAT", { params: { page: 0, size: 100 } })
      .then(function (candidatsRes) {
        setCandidats(candidatsRes.data.content || []);
        return api.get("/offres", { params: { page: 0, size: 100 } });
      })
      .then(function (offresRes) {
        setOffres(offresRes.data.content || []);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }, []);

  function onSubmit(data) {
    api
      .post("/candidatures", data)
      .then(function () {
        toast.success("Candidature soumise avec succès !");
        navigate("/candidatures");
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La création a échoué."));
      });
  }

  if (status === "loading") {
    return <Skeleton lines={5} />;
  }

  if (status === "error") {
    return <ErrorState message={error} />;
  }

  return (
    <div className="candidature-form-page">
      <div className="page-head">
        <div>
          <h1>Nouvelle candidature</h1>
          <p className="text-muted">Rattachez un candidat à une offre.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Select
          id="cand-candidat"
          label="Candidat"
          error={errors.candidatId?.message}
          {...register("candidatId")}
        >
          <option value="">Choisir un candidat…</option>
          {candidats.map((candidat) => (
            <option key={candidat.id} value={candidat.id}>
              {candidat.prenom} {candidat.nom} — {candidat.email}
            </option>
          ))}
        </Select>

        <Select
          id="cand-offre"
          label="Offre d'emploi"
          error={errors.offreId?.message}
          {...register("offreId")}
        >
          <option value="">Choisir une offre…</option>
          {offres.map((offre) => (
            <option key={offre.id} value={offre.id}>
              {offre.titre} — {offre.localisation}
            </option>
          ))}
        </Select>

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création…" : "Créer la candidature"}
          </Button>
          <Link to="/candidatures" className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}