import api from "../../api/api";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  statut: yup
    .string()
    .required("Le statut est obligatoire"),
});

function ModifieCandidature() {
  const { candidatureId } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      statut: "",
    },
  });

  useEffect(() => {
    if (candidatureId) {
      api
        .get(`/candidatures/${candidatureId}`)
        .then((res) => {
          reset({
            statut: res.data.statut || "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [candidatureId, reset]);

  function onSubmit(data) {
    api
      .patch(`/candidatures/${candidatureId}/statut/${data.statut}`)
      .then((res) => {
        console.log(res.data);
        alert("Statut de la candidature modifié avec succès !");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="page">
      <h1>Modifier une Candidature</h1>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Statut</label>
          <select {...register("statut")}>
            <option value="">
              Choisir un statut
            </option>
            <option value="EN_ATTENTE">
              En attente
            </option>
            <option value="ACCEPTEE">
              Acceptée
            </option>
            <option value="REFUSEE">
              Refusée
            </option>
          </select>
          <p className="error">{errors.statut?.message}</p>
        </div>

        <button
          className="btn-primary"
          type="submit"
        >
          Modifier
        </button>

        <Link
          className="btn-secondary"
          to={`/consulter-candidature/${candidatureId}`}
        >
          Retour
        </Link>
      </form>
    </div>
  );
}

export default ModifieCandidature;