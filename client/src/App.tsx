import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { authApi } from "./api_services/auth/AuthApiService";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import PrijavaStranica from "./pages/auth/PrijavaStranica";
import RegistracijaStranica from "./pages/auth/RegStranica";
import KontrolnaTablaUserStranica from "./pages/kontrolna_tabla/KontrolnaTablaUser";
import KontrolnaTablaAdminStranica from "./pages/kontrolna_tabla/KontrolnaTablaAdmin";
import NotFoundStranica from "./pages/not_found/NotFoundPage";
import { usersApi } from "./api_services/users/UserApiService";
import PorukeKorisnika from './components/poruke/PorukeKorisnika';
import { Profil } from "./components/profil/Profil";
import { IzmjenaProfil } from "./components/profil/IzmjenaProfil";
import "./App.css"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PrijavaStranica authApi={authApi} />} />
      <Route path="/register" element={<RegistracijaStranica authApi={authApi} />} />
      <Route path="/404" element={<NotFoundStranica />} />
      <Route path="/korisnik/:id" element={<PorukeKorisnika />} /> 
      <Route path="/profil" element={<Profil usersApi={usersApi} />} />
      <Route path="/Izmjenaprofila" element={<IzmjenaProfil usersApi={usersApi} />} />
      <Route path="/poruke/:korIme" element={<PorukeKorisnika />} />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <KontrolnaTablaUserStranica />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <KontrolnaTablaAdminStranica usersApi={usersApi} /> 
            </ProtectedRoute>
          }
        />

        {/* Preusmerava na dashboard kao default rutu */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all ruta za nepostojeće stranice */}
        <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
