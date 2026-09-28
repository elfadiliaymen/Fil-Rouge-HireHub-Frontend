import * as yup from "yup";
import { CONTRAT_VALUES } from "../constants";
import { todayString } from "../format";

export const offreFormSchema = yup.object({
  titre: yup.string().trim().required("Le titre est requis"),
  description: yup.string().trim().required("La description est requise"),
  localisation: yup.string().trim().required("La localisation est requise"),
  typeContrat: yup
    .mixed()
    .oneOf(CONTRAT_VALUES, "Type de contrat invalide")
    .required("Le type de contrat est requis"),
  dateLimite: yup
    .string()
    .required("La date limite est requise")
    .test(
      "date-limite-future",
      "La date limite doit être aujourd'hui ou dans le futur",
      function (value) {
        if (!value) return true;
        return value >= todayString();
      }
    ),
  recruteurId: yup
    .number()
    .typeError("Le recruteur est requis")
    .positive("Le recruteur est requis")
    .required("Le recruteur est requis"),
});
