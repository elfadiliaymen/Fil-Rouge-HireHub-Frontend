import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getRole, getUserId } from "../../Components/token";
import { entretienFormSchema } from "../../utils/schemas/entretienSchema";
import Input from "../../Components/ui/Input";
import Select from "../../Components/ui/Select";
import Button from "../../Components/ui/Button";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import "./Entretiens.css";

export default function ModifieEntretien() {
  const { entretienId } = useParams();
  const navigate = useNavigate();
  const role = getRole();
  const isRecruteur = role === "RECRUTEUR";

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [candidatures, setCandidatures] = useState([]);
  const [recruteurs, setRecruteurs] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(entretienFormSchema),
    defaultValues: {
      date: "",
      heure: "",
      lieu: "",
      candidatureId: "",
      recruteurId: isRecruteur ? getUserId() : "",
    },
  });

  useEffect(() => {
    api
      .get("/candidatures", { params: { page: 0, size: 100 } })
      .then(function (response) {
        setCandidatures(response.data.content || []);
      })
      .catch(function () {
        setCandidatures([]);
      });
  }, []);

  useEffect(() => {
    if (isRecruteur) return;

    api
      .get("/users/role/RECRUTEUR", { params: { page: 0, size: 100 } })
      .then(function (response) {
        setRecruteurs(response.data.content || []);
      })
      .catch(function () {
        setRecruteurs([]);
      });
  }, [isRecruteur]);

  useEffect(() => {
    api
      .get("/entretiens/" + entretienId)
      .then(function (response) {
        const entretien = response.data;
        reset({
          date: entretien.date || "",
          heure: entretien.heure || "",
          lieu: entretien.lieu || "",
          candidatureId: entretien.candidatureId || "",
          recruteurId: isRecruteur ? getUserId() : entretien.recruteur?.id || "",
        });
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }, [entretienId, reset, isRecruteur]);

  function onSubmit(data) {
    api
      .put("/entretiens/" + entretienId, data)
      .then(function () {
        toast.success("Entretien mis à jour");
        navigate("/entretiens");
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La mise à jour a échoué."));
      });
  }

  if (status === "loading") {
    return <Skeleton lines={6} />;
  }

  if (status === "error") {
    return <ErrorState message={error} />;
  }

  return (
    <div className="entretien-form-page">
      <div className="page-head">
        <div>
          <h1>Modifier l'entretien</h1>
          <p className="text-muted">Mettez à jour les informations de l'entretien.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-grid">
          <Input
            id="entretien-date"
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register("date")}
          />

          <Input
            id="entretien-heure"
            label="Heure"
            type="time"
            error={errors.heure?.message}
            {...register("heure")}
          />
        </div>

        <Input
          id="entretien-lieu"
          label="Lieu"
          placeholder="Ex. Bureau de Paris, visioconférence"
          error={errors.lieu?.message}
          {...register("lieu")}
        />

        <Select
          id="entretien-candidature"
          label="Candidature concernée"
          error={errors.candidatureId?.message}
          {...register("candidatureId")}
        >
          <option value="">Choisir une candidature…</option>
          {candidatures.map((candidature) => (
            <option key={candidature.id} value={candidature.id}>
              #{candidature.id} — {candidature.candidat?.prenom} {candidature.candidat?.nom} —{" "}
              {candidature.offre?.titre}
            </option>
          ))}
        </Select>

        {!isRecruteur && (
          <Select
            id="entretien-recruteur"
            label="Recruteur"
            error={errors.recruteurId?.message}
            {...register("recruteurId")}
          >
            <option value="">Choisir…</option>
            {recruteurs.map((recruteur) => (
              <option key={recruteur.id} value={recruteur.id}>
                {recruteur.prenom} {recruteur.nom}
              </option>
            ))}
          </Select>
        )}
        {isRecruteur && (
          <input type="hidden" {...register("recruteurId")} />
        )}

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement…" : "Enregistrer"}
          </Button>
          <Link to={`/consulter-entretien/${entretienId}`} className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}