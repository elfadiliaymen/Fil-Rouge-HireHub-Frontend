import * as yup from "yup";

export const candidatureFormSchema = yup.object({
  candidatId: yup
    .number()
    .typeError("Le candidat est obligatoire")
    .positive("Le candidat est obligatoire")
    .required("Le candidat est obligatoire"),
  offreId: yup
    .number()
    .typeError("L'offre est obligatoire")
    .positive("L'offre est obligatoire")
    .required("L'offre est obligatoire"),
});