import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// All the styles live in src/css. The order below is the cascade order:
// tokens -> base -> utilities -> patterns -> app -> shared UI -> layout
// -> auth -> pages. Later files win when two rules have the same specificity.
import "./css/tokens.css";
import "./css/base.css";
import "./css/utilities.css";
import "./css/patterns.css";
import "./css/app.css";
import "./css/ui.css";
import "./css/layout.css";
import "./css/auth.css";
import "./css/pages.css";
import "./css/users.css";
import "./css/offres.css";
import "./css/candidatures.css";
import "./css/cvs.css";
import "./css/entretiens.css";

/* Les claims sont relus depuis le token en localStorage : aucun appel réseau
   n'est nécessaire avant le premier rendu. */
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
