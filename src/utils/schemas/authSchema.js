import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().trim().email("Adresse email invalide.").required("L'email est requis."),
  password: yup.string().required("Le mot de passe est requis."),
});

export const registerSchema = yup.object({
  nom: yup.string().trim().required("Le nom est requis."),
  prenom: yup.string().trim().required("Le prénom est requis."),
  role: yup
    .string()
    .oneOf(["CANDIDAT", "RECRUTEUR"], "Rôle invalide.")
    .required("Choisissez un rôle."),
  email: yup.string().trim().email("Adresse email invalide.").required("L'email est requis."),
  password: yup
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .test(
      "strong-password",
      "Le mot de passe doit contenir une majuscule et un chiffre.",
      function strongPassword(value) {
        if (!value) return true;
        return /[A-Z]/.test(value) && /\d/.test(value);
      }
    )
    .required("Le mot de passe est requis."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Les mots de passe doivent être identiques.")
    .required("La confirmation est requise."),

  telephone: yup.string().trim().max(20, "Numéro trop long."),
  adresse: yup.string().trim().max(255, "Adresse trop longue."),

  entreprise: yup.string().trim().when("role", {
    is: "RECRUTEUR",
    then: (schema) => schema.required("L'entreprise est requise."),
    otherwise: (schema) => schema,
  }),
  poste: yup.string().trim().max(50, "Poste trop long."),
  telephonePro: yup.string().trim().max(20, "Numéro trop long."),

  dateNaissance: yup.date().typeError("Date de naissance invalide.").nullable(),
  niveauEtude: yup.string().trim().max(50, "Niveau d'étude trop long."),
  experienceAnnees: yup
    .number()
    .typeError("Années d'expérience invalides.")
    .min(0, "Valeur négative.")
    .integer("Nombre entier requis.")
    .nullable()
    .transform((value) => (value === "" ? undefined : value)),
  linkedinUrl: yup
    .string()
    .trim()
    .max(255, "URL trop longue.")
    .test("linkedin-url", "URL invalide.", function (value) {
      if (!value) return true;
      return /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i.test(value);
    }),
});