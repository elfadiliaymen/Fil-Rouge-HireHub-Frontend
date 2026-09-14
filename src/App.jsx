import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProtectedRoute from "./Components/ProtectedRoute";
import RoleGuard from "./Components/RoleGuard";
import DashboardLayout from "./Components/DashboardLayout";
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
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/users-actions"
            element={
              <RoleGuard allowedRoles={["ADMIN"]}>
                <UserActions />
              </RoleGuard>
            }
          />

          <Route
            path="/users"
            element={
              <RoleGuard allowedRoles={["ADMIN"]}>
                <UsersList />
              </RoleGuard>
            }
          />

          <Route
            path="/add-user"
            element={
              <RoleGuard allowedRoles={["ADMIN"]}>
                <AddUser />
              </RoleGuard>
            }
          />

          <Route
            path="/consulter-user/:userId"
            element={
              <RoleGuard allowedRoles={["ADMIN"]}>
                <ConsulterUser />
              </RoleGuard>
            }
          />

          <Route
            path="/update-user/:userId"
            element={
              <RoleGuard allowedRoles={["ADMIN"]}>
                <ModifieUser />
              </RoleGuard>
            }
          />

          <Route
            path="/cvs-actions"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <CvActions />
              </RoleGuard>
            }
          />

          <Route
            path="/cvs"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <CvsList />
              </RoleGuard>
            }
          />

          <Route
            path="/add-cv"
            element={
              <RoleGuard allowedRoles={["ADMIN", "CANDIDAT"]}>
                <AddCv />
              </RoleGuard>
            }
          />

          <Route
            path="/consulter-cv/:cvId"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <ConsulterCv />
              </RoleGuard>
            }
          />

          <Route
            path="/update-cv/:cvId"
            element={
              <RoleGuard allowedRoles={["ADMIN", "CANDIDAT"]}>
                <ModifieCv />
              </RoleGuard>
            }
          />

          <Route
            path="/candidatures-actions"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <CandidatureActions />
              </RoleGuard>
            }
          />

          <Route
            path="/candidatures"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <CandidaturesList />
              </RoleGuard>
            }
          />

          <Route
            path="/add-candidature"
            element={
              <RoleGuard allowedRoles={["ADMIN", "CANDIDAT"]}>
                <AddCandidature />
              </RoleGuard>
            }
          />

          <Route
            path="/consulter-candidature/:candidatureId"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <ConsulterCandidature />
              </RoleGuard>
            }
          />

          <Route
            path="/update-candidature/:candidatureId"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <ModifieCandidature />
              </RoleGuard>
            }
          />

          <Route
            path="/offres-actions"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <OffreActions />
              </RoleGuard>
            }
          />

          <Route
            path="/offres"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <OffresList />
              </RoleGuard>
            }
          />

          <Route
            path="/add-offre"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <AddOffre />
              </RoleGuard>
            }
          />

          <Route
            path="/consulter-offre/:offreId"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR", "CANDIDAT"]}>
                <ConsulterOffre />
              </RoleGuard>
            }
          />

          <Route
            path="/update-offre/:offreId"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <ModifieOffre />
              </RoleGuard>
            }
          />

          <Route
            path="/entretiens-actions"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <EntretienActions />
              </RoleGuard>
            }
          />

          <Route
            path="/entretiens"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <EntretiensList />
              </RoleGuard>
            }
          />

          <Route
            path="/add-entretien"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <AddEntretien />
              </RoleGuard>
            }
          />

          <Route
            path="/consulter-entretien/:entretienId"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <ConsulterEntretien />
              </RoleGuard>
            }
          />

          <Route
            path="/update-entretien/:entretienId"
            element={
              <RoleGuard allowedRoles={["ADMIN", "RECRUTEUR"]}>
                <ModifieEntretien />
              </RoleGuard>
            }
          />
        </Route>
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