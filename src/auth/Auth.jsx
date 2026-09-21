import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { getApiErrorMessage } from "../api/api";
import { saveSession, getRole } from "../Components/token";
import { getLandingRoute } from "../config/roles";
import Button from "../Components/ui/Button";
import Input from "../Components/ui/Input";
import { loginSchema, registerSchema } from "../utils/schemas/authSchema";
import "./auth.css";

const ROLE_CARDS = [
  { value: "CANDIDAT", label: "Candidat", description: "Je cherche un emploi" },
  { value: "RECRUTEUR", label: "Recruteur", description: "Je recrute" },
];

function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

export default function AuthPage({ mode: modeProp }) {
  const navigate = useNavigate();
  const location = useLocation();

  const params = getQueryParams();
  const mode =
    modeProp || (params.get("mode") === "register" ? "register" : "login");
  const isRegister = mode === "register";
  const expired = params.get("expired") === "1";
  const preselectedRole = params.get("role");
  const initialRole = ROLE_CARDS.some((card) => card.value === preselectedRole)
    ? preselectedRole
    : "CANDIDAT";

  const [authError, setAuthError] = useState("");
  const [selectedRole, setSelectedRole] = useState(initialRole);

  const schema = isRegister ? registerSchema : loginSchema;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: initialRole,
      telephone: "",
      adresse: "",
      entreprise: "",
      poste: "",
      telephonePro: "",
      dateNaissance: "",
      niveauEtude: "",
      experienceAnnees: "",
      linkedinUrl: "",
    },
  });

  function enterPlatform(token) {
    saveSession(token);
    const from = location.state && location.state.from;
    navigate(from || getLandingRoute(getRole()), { replace: true });
  }

  function onSubmit(data) {
    setAuthError("");

    const payload = isRegister
      ? {
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          password: data.password,
          role: data.role,
          telephone: data.telephone || null,
          adresse: data.adresse || null,
          entreprise: data.role === "RECRUTEUR" ? data.entreprise || null : null,
          poste: data.role === "RECRUTEUR" ? data.poste || null : null,
          telephonePro: data.role === "RECRUTEUR" ? data.telephonePro || null : null,
          dateNaissance: data.role === "CANDIDAT" ? data.dateNaissance || null : null,
          niveauEtude: data.role === "CANDIDAT" ? data.niveauEtude || null : null,
          experienceAnnees: data.role === "CANDIDAT" ? data.experienceAnnees || 0 : 0,
          linkedinUrl: data.role === "CANDIDAT" ? data.linkedinUrl || null : null,
        }
      : {
          email: data.email,
          password: data.password,
        };

    const request = isRegister
      ? api.post("/auth/register", payload)
      : api.post("/auth/login", payload);

    request
      .then(function (response) {
        enterPlatform(response.data);
      })
      .catch(function (error) {
        let message = getApiErrorMessage(error);
        if (!isRegister && message === "Compte désactivé") {
          message = "Ce compte est désactivé. Contactez l'administrateur.";
        }
        setAuthError(message);
      });
  }

  function switchMode(next) {
    navigate(next === "register" ? "/auth?mode=register" : "/auth");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-head">
          <span className="auth-logo">HireHub</span>
          <h1>{isRegister ? "Créer un compte" : "Se connecter"}</h1>
          <p className="text-muted">
            {isRegister
              ? "Rejoignez la plateforme pour postuler ou recruter."
              : "Accédez à votre espace pour suivre vos candidatures et offres."}
          </p>
        </div>

        {expired && (
          <div className="auth-banner" role="status">
            Votre session a expiré. Reconnectez-vous.
          </div>
        )}

        {authError && (
          <div className="auth-error" role="alert">
            {authError}
          </div>
        )}

        <div className="auth-tabs" role="tablist" aria-label="Authentification">
          <button
            type="button"
            role="tab"
            aria-selected={!isRegister}
            className={"auth-tab" + (!isRegister ? " is-active" : "")}
            onClick={() => switchMode("login")}
          >
            Connexion
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegister}
            className={"auth-tab" + (isRegister ? " is-active" : "")}
            onClick={() => switchMode("register")}
          >
            Inscription
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {isRegister ? (
            <>
              <fieldset className="auth-roles">
                <legend className="sr-only">Choisissez votre rôle</legend>
                {ROLE_CARDS.map((card) => (
                  <button
                    key={card.value}
                    type="button"
                    aria-pressed={selectedRole === card.value}
                    className={
                      "role-card" + (selectedRole === card.value ? " is-selected" : "")
                    }
                    onClick={() => {
                      setValue("role", card.value, { shouldValidate: true });
                      setSelectedRole(card.value);
                    }}
                  >
                    <strong>{card.label}</strong>
                    <span>{card.description}</span>
                  </button>
                ))}
              </fieldset>
              <input type="hidden" {...register("role")} />
              {errors.role && <p className="field-error-msg">{errors.role.message}</p>}

              <div className="auth-grid">
                <Input
                  id="auth-prenom"
                  label="Prénom"
                  placeholder="Ex. Marie"
                  autoComplete="given-name"
                  error={errors.prenom && errors.prenom.message}
                  {...register("prenom")}
                />
                <Input
                  id="auth-nom"
                  label="Nom"
                  placeholder="Ex. Dupont"
                  autoComplete="family-name"
                  error={errors.nom && errors.nom.message}
                  {...register("nom")}
                />
              </div>

              <div className="auth-grid">
                <Input
                  id="auth-telephone"
                  label="Téléphone"
                  placeholder="Ex. 06 12 34 56 78"
                  autoComplete="tel"
                  error={errors.telephone && errors.telephone.message}
                  {...register("telephone")}
                />
                <Input
                  id="auth-adresse"
                  label="Adresse"
                  placeholder="Ex. 12 rue de la République"
                  autoComplete="street-address"
                  error={errors.adresse && errors.adresse.message}
                  {...register("adresse")}
                />
              </div>

              {selectedRole === "RECRUTEUR" && (
                <div className="auth-section">
                  <h2 className="auth-section-title">Informations professionnelles</h2>
                  <div className="auth-grid">
                    <Input
                      id="auth-entreprise"
                      label="Entreprise"
                      placeholder="Ex. TechCorp"
                      error={errors.entreprise && errors.entreprise.message}
                      {...register("entreprise")}
                    />
                    <Input
                      id="auth-poste"
                      label="Poste"
                      placeholder="Ex. Responsable RH"
                      error={errors.poste && errors.poste.message}
                      {...register("poste")}
                    />
                  </div>
                  <Input
                    id="auth-telephone-pro"
                    label="Téléphone professionnel"
                    placeholder="Ex. 01 23 45 67 89"
                    autoComplete="tel"
                    error={errors.telephonePro && errors.telephonePro.message}
                    {...register("telephonePro")}
                  />
                </div>
              )}

              {selectedRole === "CANDIDAT" && (
                <div className="auth-section">
                  <h2 className="auth-section-title">Profil candidat</h2>
                  <div className="auth-grid">
                    <Input
                      id="auth-date-naissance"
                      label="Date de naissance"
                      type="date"
                      error={errors.dateNaissance && errors.dateNaissance.message}
                      {...register("dateNaissance")}
                    />
                    <Input
                      id="auth-niveau-etude"
                      label="Niveau d'étude"
                      placeholder="Ex. Master en informatique"
                      error={errors.niveauEtude && errors.niveauEtude.message}
                      {...register("niveauEtude")}
                    />
                  </div>
                  <div className="auth-grid">
                    <Input
                      id="auth-experience"
                      label="Années d'expérience"
                      type="number"
                      min="0"
                      placeholder="Ex. 3"
                      error={errors.experienceAnnees && errors.experienceAnnees.message}
                      {...register("experienceAnnees")}
                    />
                    <Input
                      id="auth-linkedin"
                      label="LinkedIn"
                      placeholder="https://www.linkedin.com/in/…"
                      error={errors.linkedinUrl && errors.linkedinUrl.message}
                      {...register("linkedinUrl")}
                    />
                  </div>
                </div>
              )}
            </>
          ) : null}

          <Input
            id="auth-email"
            label="Email"
            type="email"
            placeholder="prenom.nom@exemple.fr"
            autoComplete="email"
            error={errors.email && errors.email.message}
            {...register("email")}
          />

          <Input
            id="auth-password"
            label="Mot de passe"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            hint={isRegister ? "8 caractères minimum, une majuscule et un chiffre." : undefined}
            error={errors.password && errors.password.message}
            {...register("password")}
          />

          {isRegister && (
            <Input
              id="auth-confirm"
              label="Confirmer le mot de passe"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword && errors.confirmPassword.message}
              {...register("confirmPassword")}
            />
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="auth-submit">
            {isSubmitting
              ? isRegister
                ? "Inscription…"
                : "Connexion…"
              : isRegister
                ? "S'inscrire"
                : "Se connecter"}
          </Button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Vous avez déjà un compte ? " : "Pas encore de compte ? "}
          <button
            type="button"
            onClick={() => switchMode(isRegister ? "login" : "register")}
          >
            {isRegister ? "Se connecter" : "S'inscrire"}
          </button>
        </p>

        <p className="auth-back">
          <Link to="/">← Accueil</Link>
        </p>
      </div>
    </div>
  );
}