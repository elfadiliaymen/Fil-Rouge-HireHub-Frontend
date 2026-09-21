import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import "./Offres.css";

export default function ModifieOffre() {
  const { offreId } = useParams();
  const navigate = useNavigate();
  const role = getRole();
  const isRecruteur = role === "RECRUTEUR";

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [recruteurs, setRecruteurs] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
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
      .get("/offres/" + offreId)
      .then(function (response) {
        const offre = response.data;
        reset({
          titre: offre.titre || "",
          description: offre.description || "",
          localisation: offre.localisation || "",
          typeContrat: offre.typeContrat || "",
          dateLimite: offre.dateLimite || "",
          recruteurId: isRecruteur ? getUserId() : offre.recruteurId || "",
        });
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }, [offreId, reset, isRecruteur]);

  function onSubmit(data) {
    api
      .put("/offres/" + offreId, data)
      .then(function () {
        toast.success("Offre mise à jour");
        navigate("/offres");
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
    <div className="offre-form-page">
      <div className="page-head">
        <div>
          <h1>Modifier l'offre</h1>
          <p className="text-muted">Mettez à jour les informations du poste.</p>
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
            {isSubmitting ? "Enregistrement…" : "Enregistrer"}
          </Button>
          <Link to={`/consulter-offre/${offreId}`} className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}