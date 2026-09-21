import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getRole, getUserId } from "../../Components/token";
import { offreFormSchema } from "../../utils/schemas/offreSchema";
import { CONTRAT_LABELS, CONTRAT_VALUES } from "../../utils/constants";
import Input from "../../Components/ui/Input";
import Select from "../../Components/ui/Select";
import Textarea from "../../Components/ui/Textarea";
import Button from "../../Components/ui/Button";
import "./Offres.css";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddOffre() {
  const navigate = useNavigate();
  const role = getRole();
  const isRecruteur = role === "RECRUTEUR";

  const [recruteurs, setRecruteurs] = useState([]);

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
    resolver: yupResolver(offreFormSchema),
    defaultValues: {
      titre: "",
      description: "",
      localisation: "",
      typeContrat: "",
      dateLimite: "",
      recruteurId: isRecruteur ? getUserId() : "",
    },
  });

  function onSubmit(data) {
    api
      .post("/offres", data)
      .then(function () {
        toast.success("Offre créée avec succès !");
        navigate("/offres");
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La création a échoué."));
      });
  }

  return (
    <div className="offre-form-page">
      <div className="page-head">
        <div>
          <h1>Nouvelle offre</h1>
          <p className="text-muted">Renseignez le poste à pourvoir.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="offre-titre"
          label="Titre du poste"
          placeholder="Ex. Développeur(se) Full-Stack"
          error={errors.titre?.message}
          {...register("titre")}
        />

        <div className="form-grid">
          <Select
            id="offre-type"
            label="Type de contrat"
            error={errors.typeContrat?.message}
            {...register("typeContrat")}
          >
            <option value="">Choisir…</option>
            {CONTRAT_VALUES.map((value) => (
              <option key={value} value={value}>
                {CONTRAT_LABELS[value]}
              </option>
            ))}
          </Select>

          <Input
            id="offre-localisation"
            label="Localisation"
            placeholder="Ex. Paris"
            error={errors.localisation?.message}
            {...register("localisation")}
          />
        </div>

        <Input
          id="offre-date-limite"
          label="Date limite de candidature"
          type="date"
          min={todayString()}
          error={errors.dateLimite?.message}
          {...register("dateLimite")}
        />

        <Textarea
          id="offre-description"
          label="Description du poste"
          rows={6}
          placeholder="Missions, profil recherché, avantages…"
          error={errors.description?.message}
          {...register("description")}
        />

        {!isRecruteur && (
          <Select
            id="offre-recruteur"
            label="Recruteur responsable"
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
            {isSubmitting ? "Création…" : "Créer l'offre"}
          </Button>
          <Link to="/offres" className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}