import axios from "axios";
import { toast } from "react-toastify";
import { clearSession, getToken, isAuthenticated } from "../component/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8090/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

function isPublicPath(pathname) {
  return (
    pathname === "/" ||
    pathname.startsWith("/jobs") ||
    pathname.startsWith("/auth") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/403"
  );
}


api.interceptors.request.use(function (config) {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const status = error.response && error.response.status;

    if (status === 401 || (status === 403 && !isAuthenticated())) {
      clearSession();

      if (!isPublicPath(window.location.pathname)) {
        window.location.assign("/auth?expired=1");
      }
    } else if (status === 403) {
      if (!isPublicPath(window.location.pathname)) {
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
