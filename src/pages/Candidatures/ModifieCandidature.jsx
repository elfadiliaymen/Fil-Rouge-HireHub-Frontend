import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { STATUT_LABELS, STATUT_VALUES } from "../../utils/constants";
import { formatDate } from "../../utils/format";
import Select from "../../Components/ui/Select";
import StatusPill from "../../Components/ui/StatusPill";
import Button from "../../Components/ui/Button";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import "./Candidatures.css";

const schema = yup.object({
  statut: yup.string().oneOf(STATUT_VALUES).required("Le statut est obligatoire"),
});

export default function ModifieCandidature() {
  const { candidatureId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [candidature, setCandidature] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { statut: "" },
  });

  useEffect(() => {
    api
      .get("/candidatures/" + candidatureId)
      .then(function (response) {
        setCandidature(response.data);
        reset({ statut: response.data.statut || "" });
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }, [candidatureId, reset]);

  function onSubmit(data) {
    api
      .patch(`/candidatures/${candidatureId}/statut/${data.statut}`)
      .then(function () {
        toast.success("Statut de la candidature mis à jour");
        navigate(`/consulter-candidature/${candidatureId}`);
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "La mise à jour a échoué."));
      });
  }

  if (status === "loading") {
    return <Skeleton lines={5} />;
  }

  if (status === "error") {
    return <ErrorState message={error} />;
  }

  return (
    <div className="candidature-form-page">
      <div className="page-head">
        <div>
          <h1>Statut de la candidature</h1>
          <p className="text-muted">
            #{candidature.id} · {candidature.candidat?.prenom} {candidature.candidat?.nom} —{" "}
            {candidature.offre?.titre}
          </p>
        </div>
      </div>

      <div className="detail-card">
        <dl className="detail-grid">
          <div className="detail-field">
            <dt>Statut actuel</dt>
            <dd>
              <StatusPill status={candidature.statut} />
            </dd>
          </div>
          <div className="detail-field">
            <dt>Date de candidature</dt>
            <dd>{formatDate(candidature.dateCandidature)}</dd>
          </div>
        </dl>
      </div>

      <form className="form-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Select id="cand-statut" label="Nouveau statut" error={errors.statut?.message} {...register("statut")}>
          <option value="">Choisir un statut…</option>
          {STATUT_VALUES.map((value) => (
            <option key={value} value={value}>
              {STATUT_LABELS[value]}
            </option>
          ))}
        </Select>

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement…" : "Mettre à jour"}
          </Button>
          <Link to={`/consulter-candidature/${candidatureId}`} className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}