import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api/api";
import { isAuthenticated, getUser, clearSession } from "./token";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "./ProtectedLayout.css";

function AppLoading() {
  return (
    <div className="app-loading">
      <div className="skeleton-line skeleton-line-md" aria-hidden="true" />
    </div>
  );
}

export default function ProtectedLayout() {
  const [status, setStatus] = useState("validating");
  const [user, setUser] = useState(null);
  const [navOpen, setNavOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    let cancelled = false;
    const tokenUser = getUser();

    api
      .get("/me")
      .then(function (response) {
        if (cancelled) return;
        setUser(response.data);
        setStatus("authenticated");
      })
      .catch(function (error) {
        if (cancelled) return;

        if (error.response && error.response.status === 401) {
          clearSession();
          setStatus("unauthenticated");
        } else {
          setUser(tokenUser);
          setStatus("authenticated");
        }
      });

    return function () {
      cancelled = true;
    };
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  if (status === "validating") {
    return <AppLoading />;
  }

  return (
    <div className={"app" + (navOpen ? "" : " app-nav-closed")}>
      <Header
        user={user}
        onToggleMenu={() => {
          setNavOpen(!navOpen);
        }}
      />

      <div className="app-layout">
        <NavBar open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="app-main">
          <Outlet context={{ user, setUser }} />
        </main>
      </div>

      <Footer />
    </div>
  );
}