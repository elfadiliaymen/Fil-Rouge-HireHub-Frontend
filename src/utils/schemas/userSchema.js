import * as yup from "yup";
import { ROLES } from "../../config/roles";

const identity = {
  nom: yup.string().trim().required("Le nom est obligatoire"),
  prenom: yup.string().trim().required("Le prénom est obligatoire"),
  email: yup.string().email("L'email doit être valide").required("L'email est obligatoire"),
  role: yup
    .string()
    .oneOf(ROLES, "Rôle invalide")
    .required("Le rôle est obligatoire"),
  telephone: yup.string().trim().max(20, "Numéro trop long"),
  adresse: yup.string().trim().max(255, "Adresse trop longue"),
  entreprise: yup.string().trim().when("role", {
    is: "RECRUTEUR",
    then: (schema) => schema.required("L'entreprise est obligatoire"),
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
};

export const userCreateSchema = yup.object({
  ...identity,
  password: yup
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .matches(/\d/, "Le mot de passe doit contenir au moins un chiffre")
    .required("Le mot de passe est obligatoire"),
});

export const userUpdateSchema = yup.object({
  ...identity,
  password: yup
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .matches(/\d/, "Le mot de passe doit contenir au moins un chiffre"),
});