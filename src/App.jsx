import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProtectedRoute from "./Components/ProtectedRoute";
import RoleGuard from "./Components/RoleGuard";
import Dashboard from "./pages/Dashboard";
import UserActions from "./pages/Users/UserActions";
import UsersList from "./pages/Users/UsersList";
import AddUser from "./pages/Users/AddUser";
import ModifieUser from "./pages/Users/ModifieUser";
import ConsulterUser from "./pages/Users/ConsulterUser";
import CvActions from "./pages/Cvs/CvActions";
import CvsList from "./pages/Cvs/CvsList";
import AddCv from "./pages/Cvs/AddCv";
import ModifieCv from "./pages/Cvs/ModifieCv";
import ConsulterCv from "./pages/Cvs/ConsulterCv";
import CandidatureActions from "./pages/Candidatures/CandidatureActions";
import CandidaturesList from "./pages/Candidatures/CandidaturesList";
import AddCandidature from "./pages/Candidatures/AddCandidature";
import ModifieCandidature from "./pages/Candidatures/ModifieCandidature";
import ConsulterCandidature from "./pages/Candidatures/ConsulterCandidature";
import OffreActions from "./pages/Offres/OffreActions";
import OffresList from "./pages/Offres/OffresList";
import AddOffre from "./pages/Offres/AddOffre";
import ModifieOffre from "./pages/Offres/ModifieOffre";
import ConsulterOffre from "./pages/Offres/ConsulterOffre";
import EntretienActions from "./pages/Entretiens/EntretienActions";
import EntretiensList from "./pages/Entretiens/EntretiensList";
import AddEntretien from "./pages/Entretiens/AddEntretien";
import ModifieEntretien from "./pages/Entretiens/ModifieEntretien";
import ConsulterEntretien from "./pages/Entretiens/ConsulterEntretien";
import Register from "./auth/Register";
import Login from "./auth/Login";

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className={hideLayout ? "app app-auth" : "app"}>
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users-actions"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN"]}>
                <UserActions />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN"]}>
                <UsersList />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-user"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN"]}>
                <AddUser />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/consulter-user/:userId"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN"]}>
                <ConsulterUser />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-user/:userId"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN"]}>
                <ModifieUser />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cvs-actions"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <CvActions />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cvs"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <CvsList />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-cv"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "CANDIDAT"]}>
                <AddCv />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/consulter-cv/:cvId"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <ConsulterCv />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-cv/:cvId"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "CANDIDAT"]}>
                <ModifieCv />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidatures-actions"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <CandidatureActions />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidatures"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <CandidaturesList />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-candidature"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "CANDIDAT"]}>
                <AddCandidature />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/consulter-candidature/:candidatureId"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <ConsulterCandidature />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-candidature/:candidatureId"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <ModifieCandidature />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/offres-actions"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <OffreActions />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/offres"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <OffresList />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-offre"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <AddOffre />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/consulter-offre/:offreId"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <ConsulterOffre />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-offre/:offreId"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <ModifieOffre />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/entretiens-actions"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <EntretienActions />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/entretiens"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <EntretiensList />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-entretien"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <AddEntretien />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/consulter-entretien/:entretienId"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <ConsulterEntretien />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-entretien/:entretienId"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <ModifieEntretien />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
      </Routes>

      {!hideLayout && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
}

export default App;