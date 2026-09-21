import axios from "axios";
import { toast } from "react-toastify";
import { getToken, clearSession } from "../Components/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8090/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  function (config) {
    const token = getToken();

    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const status = error.response && error.response.status;

    if (status === 401) {
      clearSession();
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.assign("/auth?expired=1");
      }
    } else if (status === 403) {
      if (!window.location.pathname.startsWith("/403")) {
        window.location.assign("/403");
      }
    } else if (status >= 500) {
      toast.error("Une erreur serveur est survenue. Réessayez dans un instant.");
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error, fallback = "Une erreur est survenue.") {
  if (error && error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }

  if (error && error.message) {
    return error.message;
  }

  return fallback;
}

export default api;