import * as yup from "yup";

export const infoSchema = yup.object({
  nom: yup.string().required("Le nom est requis"),
  prenom: yup.string().required("Le prénom est requis"),
  role: yup.string().oneOf(["ADMIN", "RECRUTEUR", "CANDIDAT"]).required(),
  telephone: yup.string().trim().max(20, "Numéro trop long"),
  adresse: yup.string().trim().max(255, "Adresse trop longue"),
  entreprise: yup.string().trim().when("role", {
    is: "RECRUTEUR",
    then: (schema) => schema.required("L'entreprise est requise"),
    otherwise: (schema) => schema,
  }),
  poste: yup.string().trim().max(50, "Poste trop long"),
  telephonePro: yup.string().trim().max(20, "Numéro trop long"),
  dateNaissance: yup.date().typeError("Date de naissance invalide").nullable(),
  niveauEtude: yup.string().trim().max(50, "Niveau d'étude trop long"),
  experienceAnnees: yup
    .number()
    .typeError("Années d'expérience invalides")
    .min(0, "Valeur négative")
    .integer("Nombre entier requis")
    .nullable()
    .transform((value) => (value === "" ? undefined : value)),
  linkedinUrl: yup
    .string()
    .trim()
    .max(255, "URL trop longue")
    .test("linkedin-url", "URL invalide", function (value) {
      if (!value) return true;
      return /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i.test(value);
    }),
});

export const passwordSchema = yup.object({
  oldPassword: yup.string().required("Le mot de passe actuel est requis"),
  newPassword: yup
    .string()
    .min(8, "8 caractères minimum")
    .matches(/[A-Z]/, "Doit contenir une majuscule")
    .matches(/[0-9]/, "Doit contenir un chiffre")
    .required("Le nouveau mot de passe est requis"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Les mots de passe ne correspondent pas")
    .required("La confirmation est requise"),
});