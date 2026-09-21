import { jwtDecode } from "jwt-decode";

function getToken() {
  return localStorage.getItem("token");
}

function decodeToken(token) {
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

function getClaims() {
  return decodeToken(getToken());
}

function getUser() {
  const claims = getClaims();

  if (!claims) return null;

  return {
    id: claims.id || claims.userId || null,
    email: claims.email || claims.sub || null,
    role: claims.role || claims.roles || null,
  };
}

function isTokenExpired(payload) {
  if (!payload || !payload.exp) return false;

  return payload.exp * 1000 < Date.now();
}

function isAuthenticated() {
  const token = getToken();

  if (!token) return false;

  const payload = decodeToken(token);

  return !isTokenExpired(payload);
}

function getRole() {
  const user = getUser();

  return user ? user.role : null;
}

function getUserId() {
  const claims = getClaims();

  return claims && claims.id ? claims.id : null;
}

function saveSession(token) {
  localStorage.setItem("token", token);
}

function clearSession() {
  localStorage.removeItem("token");
}

export {
  getToken,
  decodeToken,
  getClaims,
  getUser,
  isTokenExpired,
  isAuthenticated,
  getRole,
  getUserId,
  saveSession,
  clearSession,
};