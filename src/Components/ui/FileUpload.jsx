import { useRef } from "react";
import "./FileUpload.css";

export default function FileUpload({
  inputId = "file-upload",
  fileName,
  multiple = false,
  onChange,
  error,
  uploading,
  progress,
}) {
  const inputRef = useRef(null);

  function handleChange(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const notPdf = files.find(
      (file) =>
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    );
    if (notPdf) {
      onChange(null, "Ce fichier n'est pas un PDF.");
      event.target.value = "";
      return;
    }

    const tooBig = files.find((file) => file.size > 5 * 1024 * 1024);
    if (tooBig) {
      onChange(null, "Ce fichier dépasse 5 Mo.");
      event.target.value = "";
      return;
    }

    onChange(multiple ? files : files[0], null);
  }

  return (
    <div className="file-upload">
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple={multiple}
        className="file-upload-input"
        onChange={handleChange}
      />

      <label htmlFor={inputId} className="file-upload-label">
        <span>
          {fileName ||
            (multiple
              ? "Choisir des fichiers (PDF, 5 Mo max)"
              : "Choisir un fichier (PDF, 5 Mo max)")}
        </span>
      </label>

      {uploading && (
        <div className="file-upload-progress" aria-live="polite">
          <div className="file-upload-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {fileName && (
        <button
          type="button"
          className="file-upload-clear"
          onClick={() => {
            if (inputRef.current) inputRef.current.value = "";
            onChange(null, null);
          }}
        >
          Retirer le fichier
        </button>
      )}

      {error && <p className="file-upload-error">{error}</p>}
    </div>
  );
}