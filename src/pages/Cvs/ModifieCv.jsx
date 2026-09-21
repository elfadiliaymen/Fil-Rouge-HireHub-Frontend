import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { formatDate } from "../../utils/format";
import FileUpload from "../../Components/ui/FileUpload";
import Button from "../../Components/ui/Button";
import Skeleton from "../../Components/ui/Skeleton";
import ErrorState from "../../Components/ui/ErrorState";
import "./Cvs.css";

export default function ModifieCv() {
  const { cvId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [cv, setCv] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  function load() {
    setStatus("loading");
    setError("");

    api
      .get("/cv/" + cvId)
      .then(function (response) {
        setCv(response.data);
        setStatus("success");
      })
      .catch(function (reason) {
        setError(getApiErrorMessage(reason));
        setStatus("error");
      });
  }

  useEffect(load, [cvId]);

  function handleFile(nextFile, nextError) {
    setFile(nextFile);
    setFileName(nextFile ? nextFile.name : "");
    setFileError(nextError || "");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setFileError("Choisissez un fichier PDF pour remplacer l'actuel.");
      return;
    }

    setUploading(true);
    setProgress(0);

    const data = new FormData();
    data.append("file", file);

    api
      .put("/cv/upload/" + cvId, data, {
        headers: { "Content-Type": undefined },
        onUploadProgress: function (eventProgress) {
          if (eventProgress.total) {
            setProgress(Math.round((eventProgress.loaded / eventProgress.total) * 100));
          }
        },
      })
      .then(function () {
        toast.success("CV remplacé avec succès !");
        navigate("/cvs");
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "Le remplacement du CV a échoué."));
        setUploading(false);
      });
  }

  if (status === "loading") {
    return <Skeleton lines={4} />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <div className="upload-cv-page">
      <div className="page-head">
        <div>
          <h1>Remplacer mon CV</h1>
          <p className="text-muted">
            Fichier actuel : <strong>{cv.nomFichier}</strong> (déposé le{" "}
            {formatDate(cv.dateUpload)}).
          </p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <FileUpload
          inputId="update-cv-file"
          fileName={fileName}
          onChange={handleFile}
          error={fileError}
          uploading={uploading}
          progress={progress}
        />

        <div className="form-actions">
          <Button type="submit" disabled={uploading}>
            {uploading ? "Remplacement…" : "Remplacer le CV"}
          </Button>
          <Link to="/cvs" className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}