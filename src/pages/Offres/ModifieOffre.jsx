import api from "../../api/api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  titre: yup
    .string()
    .required("Le titre est obligatoire"),

  description: yup
    .string()
    .required("La description est obligatoire"),

  localisation: yup
    .string()
    .required("La localisation est obligatoire"),

  typeContrat: yup
    .string()
    .required("Le type de contrat est obligatoire"),

  dateLimite: yup
    .string()
    .required("La date limite est obligatoire"),

  recruteurId: yup
    .number()
    .typeError("L'ID du recruteur doit être un nombre")
    .positive("L'ID doit être positif")
    .integer("L'ID doit être un entier")
    .required("Le recruteur est obligatoire"),
});

function ModifieOffre() {
  const { offreId } = useParams();
  const [recruteurs, setRecruteurs] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      titre: "",
      description: "",
      localisation: "",
      typeContrat: "",
      dateLimite: "",
      recruteurId: "",
    },
  });

  useEffect(() => {
    api.get("/users/role/RECRUTEUR")
      .then((res) => setRecruteurs(res.data.content))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (offreId) {
      api
        .get(`/offres/${offreId}`)
        .then((res) => {
          reset({
            titre: res.data.titre || "",
            description: res.data.description || "",
            localisation: res.data.localisation || "",
            typeContrat: res.data.typeContrat || "",
            dateLimite: res.data.dateLimite || "",
            recruteurId: res.data.recruteur?.id || "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [offreId, reset]);

  function onSubmit(data) {
    api
      .put(`/offres/${offreId}`, data)
      .then((res) => {
        console.log(res.data);
        alert("Offre modifiée avec succès !");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="page">
      <h1>Modifier une Offre</h1>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Titre</label>
          <input type="text" {...register("titre")} />
          <p className="error">{errors.titre?.message}</p>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea {...register("description")} />
          <p className="error">{errors.description?.message}</p>
        </div>

        <div className="form-group">
          <label>Localisation</label>
          <input type="text" {...register("localisation")} />
          <p className="error">{errors.localisation?.message}</p>
        </div>

        <div className="form-group">
          <label>Type de contrat</label>
          <select {...register("typeContrat")}>
            <option value="">
              Choisir un type de contrat
            </option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="STAGE">Stage</option>
            <option value="FREELANCE">Freelance</option>
            <option value="ALTERNANCE">Alternance</option>
          </select>
          <p className="error">{errors.typeContrat?.message}</p>
        </div>

        <div className="form-group">
          <label>Date limite</label>
          <input type="date" {...register("dateLimite")} />
          <p className="error">{errors.dateLimite?.message}</p>
        </div>

        <div className="form-group">
          <label>Recruteur</label>
          <select {...register("recruteurId")}>
            <option value="">
              Choisir un recruteur
            </option>

            {recruteurs.map((recruteur) => (
              <option key={recruteur.id} value={recruteur.id}>
                {recruteur.prenom} {recruteur.nom}
              </option>
            ))}
          </select>
          <p className="error">{errors.recruteurId?.message}</p>
        </div>

        <button
          className="btn-primary"
          type="submit"
        >
          Modifier
        </button>

        <Link
          className="btn-secondary"
          to={`/consulter-offre/${offreId}`}
        >
          Retour
        </Link>
      </form>
    </div>
  );
}

export default ModifieOffre;