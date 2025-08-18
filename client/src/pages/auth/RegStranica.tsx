import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegistracijaForma } from "../../components/auth/RegistracijaForma";
import type { IAuthAPIService } from "../../api_services/auth/IAuthApiService";
import { useAuth } from "../../hooks/auth/UseAuthHook";

interface RegistracijaPageProps {
  authApi: IAuthAPIService;
}

export default function RegistracijaStranica({ authApi }: RegistracijaPageProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) 
      navigate(`/${user.uloga}-dashboard`);
  }, [isAuthenticated, navigate, user]);

  return (
    <main>
      <RegistracijaForma authApi={authApi} />
    </main>
  );
}
