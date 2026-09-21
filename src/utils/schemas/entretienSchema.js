import * as yup from "yup";

export const entretienFormSchema = yup.object({
  date: yup.string().required("La date est requise"),
  heure: yup
    .string()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/, "Heure invalide (ex. 14:30)")
    .required("L'heure est requise"),
  lieu: yup.string().trim().required("Le lieu est requis"),
  candidatureId: yup
    .number()
    .typeError("La candidature est requise")
    .positive("La candidature est requise")
    .required("La candidature est requise"),
  recruteurId: yup
    .number()
    .typeError("Le recruteur est requis")
    .positive("Le recruteur est requis")
    .required("Le recruteur est requis"),
});