import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  nom: yup
    .string()
    .required("Le nom est obligatoire"),

  prenom: yup
    .string()
    .required("Le prénom est obligatoire"),

  email: yup
    .string()
    .email("Email invalide")
    .required("L'email est obligatoire"),

  password: yup
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Le mot de passe est obligatoire"),

  role: yup
    .string()
    .required("Le rôle est obligatoire"),
});

function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      role: "CANDIDAT",
    },
  });

  const navigate = useNavigate();

  function handleRegister(data) {
    api.post("/users/register", data)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        reset({
          nom: "",
          prenom: "",
          email: "",
          password: "",
          role: "CANDIDAT",
        });
        alert("Inscription réussie !");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="page">
      <div className="form-card">
        <h1>Inscription</h1>

        <form
          className="form auth-form"
          onSubmit={handleSubmit(handleRegister)}
        >
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              {...register("nom")}
            />
            <p className="error">{errors.nom?.message}</p>
          </div>

          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              {...register("prenom")}
            />
            <p className="error">{errors.prenom?.message}</p>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register("email")}
            />
            <p className="error">{errors.email?.message}</p>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              {...register("password")}
            />
            <p className="error">{errors.password?.message}</p>
          </div>

          <div className="form-group">
            <label>Rôle</label>
            <select {...register("role")}>
              <option value="">Choisir un rôle</option>
              <option value="CANDIDAT">Candidat</option>
              <option value="RECRUTEUR">Recruteur</option>
            </select>
            <p className="error">{errors.role?.message}</p>
          </div>

          <button
            className="btn-primary"
            type="submit"
          >
            S'inscrire
          </button>

          <button
            className="btn-primary"
            type="button"
            onClick={() => navigate("/login")}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;