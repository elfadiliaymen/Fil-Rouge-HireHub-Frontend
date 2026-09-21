import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import api from "../api/api";
import { getApiErrorMessage } from "../api/api";
import { infoSchema, passwordSchema } from "../utils/schemas/profileSchema";
import { ROLE_LABELS } from "../utils/constants";
import Input from "../Components/ui/Input";
import Button from "../Components/ui/Button";
import StatusPill from "../Components/ui/StatusPill";
import Skeleton from "../Components/ui/Skeleton";
import "./Profile.css";

function userInitials(user) {
  if (!user) return "?";
  const prenom = (user.prenom || "").trim();
  const nom = (user.nom || "").trim();

  if (prenom && nom) {
    return (prenom[0] + nom[0]).toUpperCase();
  }

  return ((user.email || nom || "?").trim()[0] || "?").toUpperCase();
}

export default function Profile() {
  const { user, setUser } = useOutletContext();

  const infoForm = useForm({
    resolver: yupResolver(infoSchema),
    defaultValues: {
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      role: user?.role || "CANDIDAT",
      telephone: user?.telephone || "",
      adresse: user?.adresse || "",
      entreprise: user?.entreprise || "",
      poste: user?.poste || "",
      telephonePro: user?.telephonePro || "",
      dateNaissance: user?.dateNaissance || "",
      niveauEtude: user?.niveauEtude || "",
      experienceAnnees: user?.experienceAnnees ?? "",
      linkedinUrl: user?.linkedinUrl || "",
    },
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  if (!user) {
    return (
      <div className="profile-page">
        <Skeleton lines={6} />
      </div>
    );
  }

  function onSaveInfo(data) {
    if (user.role !== data.role) {
      toast.error("Le rôle ne peut pas être modifié ici.");
      return;
    }

    const payload = {
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone || null,
      adresse: data.adresse || null,
      entreprise: user.role === "RECRUTEUR" ? data.entreprise || null : null,
      poste: user.role === "RECRUTEUR" ? data.poste || null : null,
      telephonePro: user.role === "RECRUTEUR" ? data.telephonePro || null : null,
      dateNaissance: user.role === "CANDIDAT" ? data.dateNaissance || null : null,
      niveauEtude: user.role === "CANDIDAT" ? data.niveauEtude || null : null,
      experienceAnnees: user.role === "CANDIDAT" ? data.experienceAnnees || 0 : 0,
      linkedinUrl: user.role === "CANDIDAT" ? data.linkedinUrl || null : null,
    };

    api
      .put("/me", payload)
      .then(function (response) {
        setUser(response.data);
        toast.success("Profil mis à jour");
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "Échec de la mise à jour"));
      });
  }

  function onChangePassword(data) {
    api
      .post("/me/password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
      .then(function () {
        toast.success("Mot de passe modifié");
        passwordForm.reset();
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "Échec du changement de mot de passe"));
      });
  }

  return (
    <div className="profile-page">
      <div className="page-head">
        <div>
          <h1>Mon profil</h1>
          <p className="text-muted">Gérez vos informations personnelles.</p>
        </div>
      </div>

      <div className="profile-card">
        <span className="avatar">{userInitials(user)}</span>
        <div className="profile-card-info">
          <h2>
            {user.prenom} {user.nom}
          </h2>
          <p>{user.email}</p>
          <div className="profile-tags">
            <span className="badge-solid">{ROLE_LABELS[user.role] || user.role}</span>
            <StatusPill active={user.active} />
          </div>
        </div>
      </div>

      <section className="form-card">
        <h2>Modifier mes informations</h2>
        <form onSubmit={infoForm.handleSubmit(onSaveInfo)} noValidate>
          <input type="hidden" {...infoForm.register("role")} />
          <div className="form-grid">
            <Input
              id="profile-nom"
              label="Nom"
              autoComplete="family-name"
              error={infoForm.formState.errors.nom?.message}
              {...infoForm.register("nom")}
            />
            <Input
              id="profile-prenom"
              label="Prénom"
              autoComplete="given-name"
              error={infoForm.formState.errors.prenom?.message}
              {...infoForm.register("prenom")}
            />
          </div>

          <div className="form-grid">
            <Input
              id="profile-telephone"
              label="Téléphone"
              placeholder="Ex. 06 12 34 56 78"
              autoComplete="tel"
              error={infoForm.formState.errors.telephone?.message}
              {...infoForm.register("telephone")}
            />
            <Input
              id="profile-adresse"
              label="Adresse"
              placeholder="Ex. 12 rue de la République"
              autoComplete="street-address"
              error={infoForm.formState.errors.adresse?.message}
              {...infoForm.register("adresse")}
            />
          </div>

          {user.role === "RECRUTEUR" && (
            <div className="form-section">
              <h3 className="form-section-title">Informations professionnelles</h3>
              <div className="form-grid">
                <Input
                  id="profile-entreprise"
                  label="Entreprise"
                  placeholder="Ex. TechCorp"
                  error={infoForm.formState.errors.entreprise?.message}
                  {...infoForm.register("entreprise")}
                />
                <Input
                  id="profile-poste"
                  label="Poste"
                  placeholder="Ex. Responsable RH"
                  error={infoForm.formState.errors.poste?.message}
                  {...infoForm.register("poste")}
                />
              </div>
              <Input
                id="profile-telephone-pro"
                label="Téléphone professionnel"
                placeholder="Ex. 01 23 45 67 89"
                autoComplete="tel"
                error={infoForm.formState.errors.telephonePro?.message}
                {...infoForm.register("telephonePro")}
              />
            </div>
          )}

          {user.role === "CANDIDAT" && (
            <div className="form-section">
              <h3 className="form-section-title">Profil candidat</h3>
              <div className="form-grid">
                <Input
                  id="profile-date-naissance"
                  label="Date de naissance"
                  type="date"
                  error={infoForm.formState.errors.dateNaissance?.message}
                  {...infoForm.register("dateNaissance")}
                />
                <Input
                  id="profile-niveau-etude"
                  label="Niveau d'étude"
                  placeholder="Ex. Master en informatique"
                  error={infoForm.formState.errors.niveauEtude?.message}
                  {...infoForm.register("niveauEtude")}
                />
              </div>
              <div className="form-grid">
                <Input
                  id="profile-experience"
                  label="Années d'expérience"
                  type="number"
                  min="0"
                  placeholder="Ex. 3"
                  error={infoForm.formState.errors.experienceAnnees?.message}
                  {...infoForm.register("experienceAnnees")}
                />
                <Input
                  id="profile-linkedin"
                  label="LinkedIn"
                  placeholder="https://www.linkedin.com/in/…"
                  error={infoForm.formState.errors.linkedinUrl?.message}
                  {...infoForm.register("linkedinUrl")}
                />
              </div>
            </div>
          )}

          <div className="form-actions">
            <Button
              type="submit"
              disabled={infoForm.formState.isSubmitting}
            >
              {infoForm.formState.isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </section>

      <section className="form-card">
        <h2>Changer le mot de passe</h2>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} noValidate>
          <Input
            id="profile-old-password"
            label="Mot de passe actuel"
            type="password"
            autoComplete="current-password"
            error={passwordForm.formState.errors.oldPassword?.message}
            {...passwordForm.register("oldPassword")}
          />

          <Input
            id="profile-new-password"
            label="Nouveau mot de passe"
            type="password"
            autoComplete="new-password"
            hint="8 caractères minimum, une majuscule et un chiffre."
            error={passwordForm.formState.errors.newPassword?.message}
            {...passwordForm.register("newPassword")}
          />

          <Input
            id="profile-confirm-password"
            label="Confirmer le nouveau mot de passe"
            type="password"
            autoComplete="new-password"
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register("confirmPassword")}
          />

          <div className="form-actions">
            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting
                ? "Modification…"
                : "Changer"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}