import api from "../../api/api";
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
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Le mot de passe est obligatoire"),

  role: yup
    .string()
    .required("Le rôle est obligatoire"),
});

function AddUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

  function onSubmit(data) {
    api.post("/users", data)
      .then((res) => {
        console.log(res.data);
        reset({
          nom: "",
          prenom: "",
          email: "",
          password: "",
          role: "",
        });
        alert("Utilisateur ajouté avec succès !");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="page">
      <div className="form-card">
        <h1>Ajouter un Utilisateur</h1>

        <form
          className="form"
          onSubmit={handleSubmit(onSubmit)}
        >
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
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;