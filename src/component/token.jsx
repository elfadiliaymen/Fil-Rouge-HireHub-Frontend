import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "hirehub_token";
const CLAIMS_KEY = "hirehub_claims";

function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    
  }
}

function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    
  }
}


function normalizeToken(value) {
  if (typeof value === "string") return value.trim() || null;
  if (value && typeof value === "object") {
    const nested = value.token || value.accessToken || value.access_token;
    if (typeof nested === "string") return nested.trim() || null;
  }
  return null;
}

function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

function isTokenExpired(payload) {
  if (!payload || !payload.exp) return true;
  return payload.exp * 1000 <= Date.now();
}

function buildClaims(payload) {
  if (!payload) return null;

  const role = payload.role || payload.roles?.[0] || null;

  if (payload.id == null && !payload.sub && !role) return null;

  return {
    id: payload.id ?? payload.userId ?? null,
    email: payload.email || payload.sub || null,
    role,
    exp: payload.exp || null,
  };
}

function getToken() {
  return readStorage(TOKEN_KEY);
}


function readTokenClaims() {
  const token = getToken();

  if (!token) {
    removeStorage(CLAIMS_KEY);
    return null;
  }

  const claims = buildClaims(decodeToken(token));

  if (!claims || isTokenExpired(claims)) {
    clearSession();
    return null;
  }

  return claims;
}

function readCachedClaims() {
  const raw = readStorage(CLAIMS_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getClaims() {
  const fromToken = readTokenClaims();

  if (!fromToken) return null;

  const cached = readCachedClaims();

 
  const claims =
    cached && cached.exp === fromToken.exp
      ? {
          id: cached.id ?? fromToken.id,
          email: cached.email || fromToken.email,
          role: cached.role || fromToken.role,
          exp: fromToken.exp,
        }
      : fromToken;

  writeStorage(CLAIMS_KEY, JSON.stringify(claims));

  return claims;
}

function getUser() {
  const claims = getClaims();
  return claims ? { ...claims } : null;
}

function isAuthenticated() {
  return readTokenClaims() !== null;
}

function getRole() {
  const claims = getClaims();
  return claims ? claims.role : null;
}

function getUserId() {
  const claims = getClaims();
  return claims ? claims.id : null;
}

function saveSession(value) {
  const token = normalizeToken(value);
  const claims = buildClaims(decodeToken(token));

  if (!token || !claims || isTokenExpired(claims)) {
    clearSession();
    return false;
  }

  writeStorage(TOKEN_KEY, token);
  writeStorage(CLAIMS_KEY, JSON.stringify(claims));

  return true;
}


function applyProfile(user) {
  if (!user || user.role == null) {
    clearSession();
    return;
  }

  const claims = readTokenClaims();

  if (!claims) return;

  writeStorage(
    CLAIMS_KEY,
    JSON.stringify({
      id: user.id ?? claims.id,
      email: user.email || claims.email,
      role: user.role || claims.role,
      exp: claims.exp,
    })
  );
}

function clearSession() {
  removeStorage(TOKEN_KEY);
  removeStorage(CLAIMS_KEY);
}

export {
  getToken,
  getClaims,
  getUser,
  isAuthenticated,
  isTokenExpired,
  getRole,
  getUserId,
  saveSession,
  applyProfile,
  clearSession,
};
