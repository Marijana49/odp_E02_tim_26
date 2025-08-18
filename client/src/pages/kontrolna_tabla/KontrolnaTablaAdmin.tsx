import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PročitajVrednostPoKljuču } from "../../helpers/LocalStorage";
import { useAuth } from "../../hooks/auth/UseAuthHook";
import type { IUsersAPIService } from "../../api_services/users/IUserApiService";
import { TabelaAdmin } from "../../components/kontrolna_tabla/tabelarni_prikaz_korisnika/TabelaAdmin";

interface KontrolnaTablaAdminStranicaProps {
  usersApi: IUsersAPIService;
}

export default function KontrolnaTablaAdminStranica({ usersApi }: KontrolnaTablaAdminStranicaProps) {
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
      <TabelaAdmin usersApi={usersApi} />
    </main>
  );
}
