import api from "../../api/api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  candidatId: yup
    .number()
    .typeError("L'ID du candidat doit être un nombre")
    .positive("L'ID doit être positif")
    .integer("L'ID doit être un entier")
    .required("L'ID du candidat est obligatoire"),

  nomFichier: yup
    .string()
    .required("Le nom du fichier est obligatoire"),

  cheminFichier: yup
    .string()
    .required("Le chemin du fichier est obligatoire"),
});

function ModifieCv() {
  const { cvId } = useParams();
  const [candidats, setCandidats] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      candidatId: "",
      nomFichier: "",
      cheminFichier: "",
    },
  });

  useEffect(() => {
    api.get("/users/role/CANDIDAT")
      .then((res) => setCandidats(res.data.content))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (cvId) {
      api
        .get(`/cv/${cvId}`)
        .then((res) => {
          reset({
            candidatId: res.data.candidat?.id || "",
            nomFichier: res.data.nomFichier || "",
            cheminFichier: res.data.cheminFichier || "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [cvId, reset]);

  function onSubmit(data) {
    api
      .put(`/cv/${cvId}`, data)
      .then((res) => {
        console.log(res.data);
        alert("CV modifié avec succès !");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="page">
      <h1>Modifier un CV</h1>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Candidat</label>
          <select {...register("candidatId")}>
            <option value="">
              Choisir un candidat
            </option>

            {candidats.map((candidat) => (
              <option key={candidat.id} value={candidat.id}>
                {candidat.prenom} {candidat.nom}
              </option>
            ))}
          </select>
          <p className="error">{errors.candidatId?.message}</p>
        </div>

        <div className="form-group">
          <label>Nom du fichier</label>
          <input type="text" {...register("nomFichier")} />
          <p className="error">{errors.nomFichier?.message}</p>
        </div>

        <div className="form-group">
          <label>Chemin du fichier</label>
          <input type="text" {...register("cheminFichier")} />
          <p className="error">{errors.cheminFichier?.message}</p>
        </div>

        <button
          className="btn-primary"
          type="submit"
        >
          Modifier
        </button>

        <Link
          className="btn-secondary"
          to={`/consulter-cv/${cvId}`}
        >
          Retour
        </Link>
      </form>
    </div>
  );
}

export default ModifieCv;