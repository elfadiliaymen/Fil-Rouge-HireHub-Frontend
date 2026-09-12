import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const schema = yup.object({
  email: yup
    .string()
    .email("Email invalide")
    .required("L'email est obligatoire"),

  password: yup
    .string()
    .required("Le mot de passe est obligatoire"),
});

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleLogin(data) {
    api.get(`/users/email/${data.email}`)
      .then((res) => {
        if (res.data.password === data.password) {
          localStorage.setItem("user", JSON.stringify(res.data));
          alert("Connexion réussie !");
          navigate("/dashboard");
        } else {
          alert("Email ou mot de passe incorrect.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Email ou mot de passe incorrect.");
      });
  }

  return (
    <div className="page">
      <div className="form-card">
        <h1>Connexion</h1>

        <form
          className="form auth-form"
          onSubmit={handleSubmit(handleLogin)}
        >
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register("email")}
            />
            <p className="error">
              {errors.email?.message}
            </p>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              {...register("password")}
            />
            <p className="error">
              {errors.password?.message}
            </p>
          </div>

          <button
            className="btn-primary"
            type="submit"
          >
            Se connecter
          </button>

          <button
            className="btn-primary"
            type="button"
            onClick={() => navigate("/register")}
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;