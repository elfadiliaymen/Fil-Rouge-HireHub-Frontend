import { Outlet } from "react-router-dom";
import PublicHeader from "./PublicHeader";
import Footer from "./Footer";
import "./PublicLayout.css";

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <a href="#main-content" className="skip-link">
        Aller au contenu
      </a>
      <PublicHeader />
      <main id="main-content" className="public-main">
        <Outlet />
      </main>
      <Footer variant="public" />
    </div>
  );
}