import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { userUpdateSchema } from "../../utils/schemas/userSchema";
import { ROLE_LABELS, ROLE_VALUES } from "../../utils/constants";
import Input from "../../Components/ui/Input";
import Select from "../../Components/ui/Select";
import Button from "../../Components/ui/Button";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import "./Users.css";

export default function ModifieUser() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userUpdateSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      role: "",
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

  useEffect(() => {
    api
      .get("/users/" + userId)
      .then(function (response) {
        const user = response.data;
        reset({
          nom: user.nom || "",
          prenom: user.prenom || "",
          email: user.email || "",
          password: "",
          role: user.role || "CANDIDAT",
          telephone: user.telephone || "",
          adresse: user.adresse || "",
          entreprise: user.entreprise || "",
          poste: user.poste || "",
          telephonePro: user.telephonePro || "",
          dateNaissance: user.dateNaissance || "",
          niveauEtude: user.niveauEtude || "",
          experienceAnnees: user.experienceAnnees ?? "",
          linkedinUrl: user.linkedinUrl || "",
        });
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }, [userId, reset]);

  function onSubmit(data) {
    const payload = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
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
    };

    if (data.password) {
      payload.password = data.password;
    }

    api
      .put("/users/" + userId, payload)
      .then(function () {        toast.success("Utilisateur mis à jour");
        navigate(`/consulter-user/${userId}`);
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La mise à jour a échoué."));
      });
  }

  if (status === "loading") {
    return <Skeleton lines={6} />;
  }

  if (status === "error") {
    return <ErrorState message={error} />;
  }

  return (
    <div className="user-form-page">
      <div className="page-head">
        <div>
          <h1>Modifier l'utilisateur</h1>
          <p className="text-muted">Laissez le mot de passe vide pour le conserver.</p>
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
          label="Nouveau mot de passe"
          type="password"
          hint="Laisser vide pour conserver l'actuel. Sinon 8 caractères minimum, avec majuscule et chiffre."
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
            {isSubmitting ? "Enregistrement…" : "Enregistrer"}
          </Button>
          <Link to={`/consulter-user/${userId}`} className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}