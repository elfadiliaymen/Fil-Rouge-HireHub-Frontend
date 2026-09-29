import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedLayout from "./component/ProtectedLayout";
import PublicLayout from "./component/PublicLayout";
import RoleGuard from "./component/RoleGuard";
import AccessDenied from "./component/AccessDenied";
import NotFound from "./component/NotFound";
import { isAuthenticated, getRole } from "./component/token";
import { ROLES, MANAGEMENT_ROLES, getLandingRoute } from "./config/roles";

import AuthPage from "./auth/Auth";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

import UserActions from "./pages/users/UserActions";
import UsersList from "./pages/users/UsersList";
import AddUser from "./pages/users/AddUser";
import ModifieUser from "./pages/users/ModifieUser";
import ConsulterUser from "./pages/users/ConsulterUser";

import OffreActions from "./pages/offres/OffreActions";
import OffresList from "./pages/offres/OffresList";
import AddOffre from "./pages/offres/AddOffre";
import ModifieOffre from "./pages/offres/ModifieOffre";
import ConsulterOffre from "./pages/offres/ConsulterOffre";
import OffresPubliques from "./pages/offres/OffresPubliques";
import OffrePublique from "./pages/offres/OffrePublique";

import CandidatureActions from "./pages/candidatures/CandidatureActions";
import CandidaturesList from "./pages/candidatures/CandidaturesList";
import AddCandidature from "./pages/candidatures/AddCandidature";
import ModifieCandidature from "./pages/candidatures/ModifieCandidature";
import ConsulterCandidature from "./pages/candidatures/ConsulterCandidature";

import CvActions from "./pages/cvs/CvActions";
import CvsList from "./pages/cvs/CvsList";
import AddCv from "./pages/cvs/AddCv";
import ModifieCv from "./pages/cvs/ModifieCv";
import ConsulterCv from "./pages/cvs/ConsulterCv";

import EntretienActions from "./pages/entretiens/EntretienActions";
import EntretiensList from "./pages/entretiens/EntretiensList";
import AddEntretien from "./pages/entretiens/AddEntretien";
import ModifieEntretien from "./pages/entretiens/ModifieEntretien";
import ConsulterEntretien from "./pages/entretiens/ConsulterEntretien";

const ADMIN = ["ADMIN"];
const CANDIDAT = ["CANDIDAT"];

// Anyone already logged in never sees the login / register / landing pages,
// they are sent straight to the home page of their role.
function PublicOnly({ children }) {
  if (isAuthenticated()) {
    return <Navigate to={getLandingRoute(getRole())} replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <PublicOnly>
              <AuthPage />
            </PublicOnly>
          }
        />

        <Route
          path="/login"
          element={
            <PublicOnly>
              <AuthPage mode="login" />
            </PublicOnly>
          }
        />

        <Route
          path="/register"
          element={
            <PublicOnly>
              <AuthPage mode="register" />
            </PublicOnly>
          }
        />

        <Route path="/403" element={<AccessDenied />} />

        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={
              <PublicOnly>
                <Landing />
              </PublicOnly>
            }
          />
          <Route path="/jobs" element={<OffresPubliques />} />
          <Route path="/jobs/:offreId" element={<OffrePublique />} />
        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path="/access-denied" element={<AccessDenied />} />

          <Route
            path="/dashboard"
            element={
              <RoleGuard allowedRoles={ROLES}>
                <Dashboard />
              </RoleGuard>
            }
          />

          <Route
            path="/profile"
            element={
              <RoleGuard allowedRoles={ROLES}>
                <Profile />
              </RoleGuard>
            }
          />

          <Route
            path="/offres-actions"
            element={
              <RoleGuard allowedRoles={MANAGEMENT_ROLES}>
                <OffreActions />
              </RoleGuard>
            }
          />

          <Route
            path="/offres"
            element={
              <RoleGuard allowedRoles={ROLES}>
                <OffresList />
              </RoleGuard>
            }
          />

          <Route
            path="/add-offre"
            element={
              <RoleGuard allowedRoles={MANAGEMENT_ROLES}>
                <AddOffre />
              </RoleGuard>
            }
          />

          <Route
            path="/consulter-offre/:offreId"
            element={
              <RoleGuard allowedRoles={ROLES}>
                <ConsulterOffre />
              </RoleGuard>
            }
          />

          <Route
            path="/update-offre/:offreId"
            element={
              <RoleGuard allowedRoles={MANAGEMENT_ROLES}>
                <ModifieOffre />
              </RoleGuard>
            }
          />

          <Route
            path="/candidatures-actions"
            element={
              <RoleGuard allowedRoles={MANAGEMENT_ROLES}>
                <CandidatureActions />
              </RoleGuard>
            }
          />

          <Route
            path="/candidatures"
            element={
              <RoleGuard allowedRoles={ROLES}>
                <CandidaturesList />
              </RoleGuard>
            }
          />

          <Route
            path="/add-candidature"
            element={
              <RoleGuard allowedRoles={ADMIN}>
                <AddCandidature />
              </RoleGuard>
            }
          />

          <Route
            path="/consulter-candidature/:candidatureId"
            element={
              <RoleGuard allowedRoles={ROLES}>
                <ConsulterCandidature />
              </RoleGuard>
            }
          />

          <Route
            path="/update-candidature/:candidatureId"
            element={
              <RoleGuard allowedRoles={MANAGEMENT_ROLES}>
                <ModifieCandidature />
              </RoleGuard>
            }
          />

          <Route
            path="/cvs-actions"
            element={
              <RoleGuard allowedRoles={CANDIDAT}>
                <CvActions />
              </RoleGuard>
            }
          />

          <Route
            path="/cvs"
            element={
              <RoleGuard allowedRoles={CANDIDAT}>
                <CvsList />
              </RoleGuard>
            }
          />

          <Route
            path="/add-cv"
            element={
              <RoleGuard allowedRoles={CANDIDAT}>
                <AddCv />
              </RoleGuard>
            }
          />

          <Route
            path="/consulter-cv/:cvId"
            element={
              <RoleGuard allowedRoles={CANDIDAT}>
                <ConsulterCv />
              </RoleGuard>
            }
          />

          <Route
            path="/update-cv/:cvId"
            element={
              <RoleGuard allowedRoles={CANDIDAT}>
                <ModifieCv />
              </RoleGuard>
            }
          />

          <Route
            path="/entretiens-actions"
            element={
              <RoleGuard allowedRoles={MANAGEMENT_ROLES}>
                <EntretienActions />
              </RoleGuard>
            }
          />

          <Route
            path="/entretiens"
            element={
              <RoleGuard allowedRoles={ROLES}>
                <EntretiensList />
              </RoleGuard>
            }
          />

          <Route
            path="/add-entretien"
            element={
              <RoleGuard allowedRoles={MANAGEMENT_ROLES}>
                <AddEntretien />
              </RoleGuard>
            }
          />

          <Route
            path="/consulter-entretien/:entretienId"
            element={
              <RoleGuard allowedRoles={ROLES}>
                <ConsulterEntretien />
              </RoleGuard>
            }
          />

          <Route
            path="/update-entretien/:entretienId"
            element={
              <RoleGuard allowedRoles={MANAGEMENT_ROLES}>
                <ModifieEntretien />
              </RoleGuard>
            }
          />

          <Route
            path="/users-actions"
            element={
              <RoleGuard allowedRoles={ADMIN}>
                <UserActions />
              </RoleGuard>
            }
          />

          <Route
            path="/users"
            element={
              <RoleGuard allowedRoles={ADMIN}>
                <UsersList />
              </RoleGuard>
            }
          />

          <Route
            path="/add-user"
            element={
              <RoleGuard allowedRoles={ADMIN}>
                <AddUser />
              </RoleGuard>
            }
          />

          <Route
            path="/consulter-user/:userId"
            element={
              <RoleGuard allowedRoles={ADMIN}>
                <ConsulterUser />
              </RoleGuard>
            }
          />

          <Route
            path="/update-user/:userId"
            element={
              <RoleGuard allowedRoles={ADMIN}>
                <ModifieUser />
              </RoleGuard>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="dark"
      />
    </>
  );
}

export default App;
