import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8090/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          alert("Requête invalide.");
          break;
        case 401:
          localStorage.removeItem("token");
          alert("Session expirée. Veuillez vous reconnecter.");
          window.location.href = "/login";
          break;
        case 403:
          alert("Accès interdit.");
          break;
        case 404:
          alert("Ressource introuvable.");
          break;
        case 500:
          alert("Erreur interne du serveur.");
          break;
        default:
          alert("Une erreur est survenue.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;