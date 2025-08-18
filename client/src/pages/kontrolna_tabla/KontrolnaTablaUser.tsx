import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PročitajVrednostPoKljuču } from "../../helpers/LocalStorage";
import { useAuth } from "../../hooks/auth/UseAuthHook";
import { TabelaKorisnika } from "../../components/kontrolna_tabla/tabelarni_prikaz_korisnika/TabelaKorisnika";
import { usersApi } from "../../api_services/users/UserApiService";

export default function KontrolnaTablaUserStranica() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = PročitajVrednostPoKljuču("authToken");

    if (!isAuthenticated || !token) {
      logout();
      navigate("/login");
    }
  }, [isAuthenticated, logout, navigate]);

  return (
    <main>
      <TabelaKorisnika usersApi={usersApi} />
    </main>
  );
}
