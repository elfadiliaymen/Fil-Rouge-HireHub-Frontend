import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getRole, getUserId } from "../../Components/token";
import { entretienFormSchema } from "../../utils/schemas/entretienSchema";
import Input from "../../Components/ui/Input";
import Select from "../../Components/ui/Select";
import Button from "../../Components/ui/Button";
import "./Entretiens.css";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddEntretien() {
  const navigate = useNavigate();
  const role = getRole();
  const isRecruteur = role === "RECRUTEUR";

  const [candidatures, setCandidatures] = useState([]);
  const [recruteurs, setRecruteurs] = useState([]);

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

  const {
    register,
    handleSubmit,
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

  function onSubmit(data) {
    api
      .post("/entretiens", data)
      .then(function () {
        toast.success("Entretien planifié !");
        navigate("/entretiens");
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La planification a échoué."));
      });
  }

  return (
    <div className="entretien-form-page">
      <div className="page-head">
        <div>
          <h1>Planifier un entretien</h1>
          <p className="text-muted">Rattachez l'entretien à une candidature.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-grid">
          <Input
            id="entretien-date"
            label="Date"
            type="date"
            min={todayString()}
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
            {isSubmitting ? "Planification…" : "Planifier"}
          </Button>
          <Link to="/entretiens" className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}