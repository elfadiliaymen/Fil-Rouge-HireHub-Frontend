import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import ProtectedLayout from "./Components/ProtectedLayout";
import PublicLayout from "./Components/PublicLayout";
import RoleGuard from "./Components/RoleGuard";
import AccessDenied from "./Components/AccessDenied";
import NotFound from "./Components/NotFound";
import AuthPage from "./auth/Auth";
import Styleguide from "./pages/Styleguide";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import { isAuthenticated, getRole } from "./Components/token";
import { ROLES, MANAGEMENT_ROLES, getLandingRoute } from "./config/roles";
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
import OffresPubliques from "./pages/Offres/OffresPubliques";
import OffrePublique from "./pages/Offres/OffrePublique";
import EntretienActions from "./pages/Entretiens/EntretienActions";
import EntretiensList from "./pages/Entretiens/EntretiensList";
import AddEntretien from "./pages/Entretiens/AddEntretien";
import ModifieEntretien from "./pages/Entretiens/ModifieEntretien";
import ConsulterEntretien from "./pages/Entretiens/ConsulterEntretien";

const PROTECTED_ROUTES = [
  // Général
  { path: "/dashboard", element: <Dashboard />, roles: ROLES },
  { path: "/profile", element: <Profile />, roles: ROLES },

  // Offres
  { path: "/offres-actions", element: <OffreActions />, roles: MANAGEMENT_ROLES },
  { path: "/offres", element: <OffresList />, roles: ROLES },
  { path: "/add-offre", element: <AddOffre />, roles: MANAGEMENT_ROLES },
  { path: "/consulter-offre/:offreId", element: <ConsulterOffre />, roles: ROLES },
  { path: "/update-offre/:offreId", element: <ModifieOffre />, roles: MANAGEMENT_ROLES },

  // Candidatures
  {
    path: "/candidatures-actions",
    element: <CandidatureActions />,
    roles: MANAGEMENT_ROLES,
  },
  { path: "/candidatures", element: <CandidaturesList />, roles: ROLES },
  { path: "/add-candidature", element: <AddCandidature />, roles: ["ADMIN"] },
  {
    path: "/consulter-candidature/:candidatureId",
    element: <ConsulterCandidature />,
    roles: ROLES,
  },
  {
    path: "/update-candidature/:candidatureId",
    element: <ModifieCandidature />,
    roles: MANAGEMENT_ROLES,
  },

  // CV (espace candidat)
  { path: "/cvs-actions", element: <CvActions />, roles: ["CANDIDAT"] },
  { path: "/cvs", element: <CvsList />, roles: ["CANDIDAT"] },
  { path: "/add-cv", element: <AddCv />, roles: ["CANDIDAT"] },
  { path: "/consulter-cv/:cvId", element: <ConsulterCv />, roles: ["CANDIDAT"] },
  { path: "/update-cv/:cvId", element: <ModifieCv />, roles: ["CANDIDAT"] },

  // Entretiens
  {
    path: "/entretiens-actions",
    element: <EntretienActions />,
    roles: MANAGEMENT_ROLES,
  },
  {
    path: "/entretiens",
    element: <EntretiensList />,
    roles: MANAGEMENT_ROLES,
  },
  {
    path: "/add-entretien",
    element: <AddEntretien />,
    roles: MANAGEMENT_ROLES,
  },
  {
    path: "/consulter-entretien/:entretienId",
    element: <ConsulterEntretien />,
    roles: MANAGEMENT_ROLES,
  },
  {
    path: "/update-entretien/:entretienId",
    element: <ModifieEntretien />,
    roles: MANAGEMENT_ROLES,
  },

  // Utilisateurs (admin uniquement)
  { path: "/users-actions", element: <UserActions />, roles: ["ADMIN"] },
  { path: "/users", element: <UsersList />, roles: ["ADMIN"] },
  { path: "/add-user", element: <AddUser />, roles: ["ADMIN"] },
  { path: "/consulter-user/:userId", element: <ConsulterUser />, roles: ["ADMIN"] },
  { path: "/update-user/:userId", element: <ModifieUser />, roles: ["ADMIN"] },
];

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
          <Route path="/styleguide" element={<Styleguide />} />
          <Route path="/jobs" element={<OffresPubliques />} />
          <Route path="/jobs/:offreId" element={<OffrePublique />} />
        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path="/access-denied" element={<AccessDenied />} />

          {PROTECTED_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <RoleGuard allowedRoles={route.roles}>
                  {route.element}
                </RoleGuard>
              }
            />
          ))}
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