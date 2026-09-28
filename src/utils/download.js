import api from "../api/api";

export function downloadCv(cvId, nomFichier = "cv.pdf") {
  return api
    .get("/cv/download/" + cvId, { responseType: "blob" })
    .then(function (response) {
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = nomFichier;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
}
