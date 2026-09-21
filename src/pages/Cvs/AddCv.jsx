import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { getApiErrorMessage } from "../../api/api";
import { getUserId } from "../../Components/token";
import FileUpload from "../../Components/ui/FileUpload";
import Button from "../../Components/ui/Button";
import "./Cvs.css";

function uploadFiles(userId, files, onProgress) {
  let request = null;

  files.forEach(function (file, index) {
    const offset = index / files.length;
    const span = 1 / files.length;

    function upload() {
      const data = new FormData();
      data.append("file", file);
      data.append("candidatId", String(userId));

      return api.post("/cv/upload", data, {
        headers: { "Content-Type": undefined },
        onUploadProgress: function (eventProgress) {
          if (eventProgress.total) {
            const fileProgress = eventProgress.loaded / eventProgress.total;
            onProgress(Math.min(100, Math.round((offset + fileProgress * span) * 100)));
          }
        },
      });
    }

    request = request ? request.then(upload) : upload();
  });

  return request;
}

export default function AddCv() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  function handleFile(nextFiles, nextError) {
    if (nextFiles) {
      const list = Array.isArray(nextFiles) ? nextFiles : [nextFiles];
      setFiles(list);
      setFileName(
        list.length > 1 ? `${list.length} fichiers sélectionnés` : list[0].name
      );
    } else {
      setFiles([]);
      setFileName("");
    }
    setFileError(nextError || "");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (files.length === 0) {
      setFileError("Choisissez au moins un fichier PDF.");
      return;
    }

    setUploading(true);
    setProgress(0);

    uploadFiles(getUserId(), files, setProgress)
      .then(function () {
        toast.success("CV déposé avec succès !");
        navigate("/cvs");
      })
      .catch(function (reason) {
        toast.error(getApiErrorMessage(reason, "Le dépôt du CV a échoué."));
        setUploading(false);
      });
  }

  return (
    <div className="upload-cv-page">
      <div className="page-head">
        <div>
          <h1>Déposer mes CV</h1>
          <p className="text-muted">
            Vos CV doivent être au format PDF (5 Mo maximum chacun).
          </p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <FileUpload
          inputId="add-cv-file"
          fileName={fileName}
          multiple
          onChange={handleFile}
          error={fileError}
          uploading={uploading}
          progress={progress}
        />

        <div className="form-actions">
          <Button type="submit" disabled={uploading}>
            {uploading ? "Dépôt en cours…" : "Déposer le(s) CV"}
          </Button>
          <Link to="/cvs" className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}