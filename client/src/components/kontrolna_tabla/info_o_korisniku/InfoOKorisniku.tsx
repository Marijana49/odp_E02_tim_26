import { jwtDecode } from "jwt-decode";
import { PročitajVrednostPoKljuču, ObrišiVrednostPoKljuču } from "../../../helpers/LocalStorage";
import { useAuth } from "../../../hooks/auth/UseAuthHook";
import type { JwtTokenClaims } from "../../../types/auth/JwtTokenClaims";

export function InformacijeOKorisniku() {
  const token = PročitajVrednostPoKljuču("authToken");
  const { logout } = useAuth();

  if (!token) return null;

  const { id, korisnickoIme, uloga } = jwtDecode<JwtTokenClaims>(token);

  const handleLogout = () => {
    ObrišiVrednostPoKljuču("authToken");
    logout();
  };

  return (
    <div>
      <h1>Контролна табла</h1>

      <div>
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Корисничко име:</strong> {korisnickoIme}</p>
        <p><strong>Улога:</strong> {uloga}</p>
        <p><strong>Датум и вријеме:</strong> {new Date().toLocaleString()}</p>
      </div>

      <button
        onClick={handleLogout}
      >
        Напусти контролну таблу
      </button>
    </div>
  );
}
