import api from "../../api/api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  date: yup
    .string()
    .required("La date est obligatoire"),

  heure: yup
    .string()
    .required("L'heure est obligatoire"),

  lieu: yup
    .string()
    .required("Le lieu est obligatoire"),

  candidatureId: yup
    .number()
    .typeError("L'ID de la candidature doit être un nombre")
    .positive("L'ID doit être positif")
    .integer("L'ID doit être un entier")
    .required("La candidature est obligatoire"),

  recruteurId: yup
    .number()
    .typeError("L'ID du recruteur doit être un nombre")
    .positive("L'ID doit être positif")
    .integer("L'ID doit être un entier")
    .required("Le recruteur est obligatoire"),
});

function ModifieEntretien() {
  const { entretienId } = useParams();
  const [candidatures, setCandidatures] = useState([]);
  const [recruteurs, setRecruteurs] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: "",
      heure: "",
      lieu: "",
      candidatureId: "",
      recruteurId: "",
    },
  });

  useEffect(() => {
    api.get("/candidatures")
      .then((res) => setCandidatures(res.data.content))
      .catch((err) => console.log(err));

    api.get("/users/role/RECRUTEUR")
      .then((res) => setRecruteurs(res.data.content))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (entretienId) {
      api
        .get(`/entretiens/${entretienId}`)
        .then((res) => {
          reset({
            date: res.data.date || "",
            heure: res.data.heure || "",
            lieu: res.data.lieu || "",
            candidatureId: res.data.candidatureId || "",
            recruteurId: res.data.recruteur?.id || "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [entretienId, reset]);

  function onSubmit(data) {
    api
      .put(`/entretiens/${entretienId}`, data)
      .then((res) => {
        console.log(res.data);
        alert("Entretien modifié avec succès !");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="page">
      <h1>Modifier un Entretien</h1>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Date</label>
          <input type="date" {...register("date")} />
          <p className="error">{errors.date?.message}</p>
        </div>

        <div className="form-group">
          <label>Heure</label>
          <input type="time" {...register("heure")} />
          <p className="error">{errors.heure?.message}</p>
        </div>

        <div className="form-group">
          <label>Lieu</label>
          <input type="text" {...register("lieu")} />
          <p className="error">{errors.lieu?.message}</p>
        </div>

        <div className="form-group">
          <label>Candidature</label>
          <select {...register("candidatureId")}>
            <option value="">
              Choisir une candidature
            </option>

            {candidatures.map((candidature) => (
              <option key={candidature.id} value={candidature.id}>
                {candidature.offre?.titre} - {candidature.candidat?.prenom}{" "}
                {candidature.candidat?.nom}
              </option>
            ))}
          </select>
          <p className="error">{errors.candidatureId?.message}</p>
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
          to={`/consulter-entretien/${entretienId}`}
        >
          Retour
        </Link>
      </form>
    </div>
  );
}

export default ModifieEntretien;