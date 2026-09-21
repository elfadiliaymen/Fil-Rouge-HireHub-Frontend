import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { userCreateSchema } from "../../utils/schemas/userSchema";
import { ROLE_LABELS, ROLE_VALUES } from "../../utils/constants";
import Input from "../../Components/ui/Input";
import Select from "../../Components/ui/Select";
import Button from "../../Components/ui/Button";
import "./Users.css";

export default function AddUser() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userCreateSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      role: "CANDIDAT",
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

  const selectedRole = watch("role");

  function onSubmit(data) {
    api
      .post("/users", data)
      .then(function () {
        toast.success("Utilisateur créé !");
        navigate("/users");
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La création a échoué."));
      });
  }

  return (
    <div className="user-form-page">
      <div className="page-head">
        <div>
          <h1>Nouvel utilisateur</h1>
          <p className="text-muted">Créez un compte sur la plateforme.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-grid">
          <Input
            id="user-nom"
            label="Nom"
            placeholder="Ex. Dupont"
            error={errors.nom?.message}
            {...register("nom")}
          />
          <Input
            id="user-prenom"
            label="Prénom"
            placeholder="Ex. Alice"
            error={errors.prenom?.message}
            {...register("prenom")}
          />
        </div>

        <Input
          id="user-email"
          label="Email"
          type="email"
          placeholder="ex. alice@exemple.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="user-password"
          label="Mot de passe"
          type="password"
          hint="8 caractères minimum, au moins une majuscule et un chiffre."
          error={errors.password?.message}
          {...register("password")}
        />

        <Select id="user-role" label="Rôle" error={errors.role?.message} {...register("role")}>
          {ROLE_VALUES.map((value) => (
            <option key={value} value={value}>
              {ROLE_LABELS[value]}
            </option>
          ))}
        </Select>

        <div className="form-grid">
          <Input
            id="user-telephone"
            label="Téléphone"
            placeholder="Ex. 06 12 34 56 78"
            error={errors.telephone?.message}
            {...register("telephone")}
          />
          <Input
            id="user-adresse"
            label="Adresse"
            placeholder="Ex. 12 rue de la République"
            error={errors.adresse?.message}
            {...register("adresse")}
          />
        </div>

        {selectedRole === "RECRUTEUR" && (
          <div className="form-section">
            <h2 className="form-section-title">Informations professionnelles</h2>
            <div className="form-grid">
              <Input
                id="user-entreprise"
                label="Entreprise"
                placeholder="Ex. TechCorp"
                error={errors.entreprise?.message}
                {...register("entreprise")}
              />
              <Input
                id="user-poste"
                label="Poste"
                placeholder="Ex. Responsable RH"
                error={errors.poste?.message}
                {...register("poste")}
              />
            </div>
            <Input
              id="user-telephone-pro"
              label="Téléphone professionnel"
              placeholder="Ex. 01 23 45 67 89"
              error={errors.telephonePro?.message}
              {...register("telephonePro")}
            />
          </div>
        )}

        {selectedRole === "CANDIDAT" && (
          <div className="form-section">
            <h2 className="form-section-title">Profil candidat</h2>
            <div className="form-grid">
              <Input
                id="user-date-naissance"
                label="Date de naissance"
                type="date"
                error={errors.dateNaissance?.message}
                {...register("dateNaissance")}
              />
              <Input
                id="user-niveau-etude"
                label="Niveau d'étude"
                placeholder="Ex. Master en informatique"
                error={errors.niveauEtude?.message}
                {...register("niveauEtude")}
              />
            </div>
            <div className="form-grid">
              <Input
                id="user-experience"
                label="Années d'expérience"
                type="number"
                min="0"
                placeholder="Ex. 3"
                error={errors.experienceAnnees?.message}
                {...register("experienceAnnees")}
              />
              <Input
                id="user-linkedin"
                label="LinkedIn"
                placeholder="https://www.linkedin.com/in/…"
                error={errors.linkedinUrl?.message}
                {...register("linkedinUrl")}
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création…" : "Créer l'utilisateur"}
          </Button>
          <Link to="/users" className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}