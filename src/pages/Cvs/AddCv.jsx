import api from "../../api/api";
import { useEffect, useState } from "react";
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

function AddCv() {
  const [candidats, setCandidats] = useState([]);

  useEffect(() => {
    api.get("/users/role/CANDIDAT")
      .then((res) => setCandidats(res.data.content))
      .catch((err) => console.log(err));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      candidatId: "",
      nomFichier: "",
      cheminFichier: "",
    },
  });

  function onSubmit(data) {
    api.post("/cv", data)
      .then((res) => {
        console.log(res.data);
        reset({
          candidatId: "",
          nomFichier: "",
          cheminFichier: "",
        });
        alert("CV ajouté avec succès !");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="page">
      <div className="form-card">
        <h1>Ajouter un CV</h1>

        <form
          className="form"
          onSubmit={handleSubmit(onSubmit)}
        >
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
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCv;