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

  offreId: yup
    .number()
    .typeError("L'ID de l'offre doit être un nombre")
    .positive("L'ID doit être positif")
    .integer("L'ID doit être un entier")
    .required("L'ID de l'offre est obligatoire"),
});

function AddCandidature() {
  const [candidats, setCandidats] = useState([]);
  const [offres, setOffres] = useState([]);

  useEffect(() => {
    api.get("/users/role/CANDIDAT")
      .then((res) => setCandidats(res.data.content))
      .catch((err) => console.log(err));

    api.get("/offres")
      .then((res) => setOffres(res.data.content))
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
      offreId: "",
    },
  });

  function onSubmit(data) {
    api.post("/candidatures", data)
      .then((res) => {
        console.log(res.data);
        reset({
          candidatId: "",
          offreId: "",
        });
        alert("Candidature soumise avec succès !");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="page">
      <div className="form-card">
        <h1>Ajouter une Candidature</h1>

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
            <label>Offre d'emploi</label>
            <select {...register("offreId")}>
              <option value="">
                Choisir une offre
              </option>

              {offres.map((offre) => (
                <option key={offre.id} value={offre.id}>
                  {offre.titre}
                </option>
              ))}
            </select>
            <p className="error">{errors.offreId?.message}</p>
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

export default AddCandidature;