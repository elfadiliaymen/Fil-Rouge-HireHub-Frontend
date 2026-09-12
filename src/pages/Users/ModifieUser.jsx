import api from "../../api/api";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  nom: yup
    .string()
    .required("Le nom est obligatoire"),

  prenom: yup
    .string()
    .required("Le prénom est obligatoire"),

  email: yup
    .string()
    .email("L'email doit être valide")
    .required("L'email est obligatoire"),

  password: yup
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),

  role: yup
    .string()
    .required("Le rôle est obligatoire"),
});

function ModifieUser() {
  const { userId } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      role: "",
    },
  });

  useEffect(() => {
    if (userId) {
      api
        .get(`/users/${userId}`)
        .then((res) => {
          reset({
            nom: res.data.nom || "",
            prenom: res.data.prenom || "",
            email: res.data.email || "",
            password: "",
            role: res.data.role || "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userId, reset]);

  function onSubmit(data) {
    api
      .put(`/users/${userId}`, data)
      .then((res) => {
        console.log(res.data);
        alert("Utilisateur modifié avec succès !");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="page">
      <h1>Modifier un Utilisateur</h1>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Nom</label>
          <input type="text" {...register("nom")} />
          <p className="error">{errors.nom?.message}</p>
        </div>

        <div className="form-group">
          <label>Prénom</label>
          <input type="text" {...register("prenom")} />
          <p className="error">{errors.prenom?.message}</p>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register("email")} />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" {...register("password")} />
          <p className="error">{errors.password?.message}</p>
        </div>

        <div className="form-group">
          <label>Rôle</label>
          <select {...register("role")}>
            <option value="">
              Choisir un rôle
            </option>
            <option value="ADMIN">Admin</option>
            <option value="RECRUTEUR">Recruteur</option>
            <option value="CANDIDAT">Candidat</option>
          </select>
          <p className="error">{errors.role?.message}</p>
        </div>

        <button
          className="btn-primary"
          type="submit"
        >
          Modifier
        </button>

        <Link
          className="btn-secondary"
          to={`/consulter-user/${userId}`}
        >
          Retour
        </Link>
      </form>
    </div>
  );
}

export default ModifieUser;