import { useEffect, useState } from "react";
import type { IUsersAPIService } from "../../../api_services/users/IUserApiService";
import type { UserDto } from "../../../models/users/UserDTO";
import { RedUTabeliKorisnika } from "./RedUTabeliKorisnika";
import { useAuth } from "../../../hooks/auth/UseAuthHook";
import { ObrišiVrednostPoKljuču } from "../../../helpers/LocalStorage";
import { Link } from "react-router-dom";
import defaultAvatar from "../../../assets/default-avatar.svg.png";

interface TabelaKorisnikaProps {
  usersApi: IUsersAPIService;
}

export function TabelaKorisnika({ usersApi }: TabelaKorisnikaProps) {
  const [korisnici, setKorisnici] = useState<UserDto[]>([]);
  const { token, logout } = useAuth();

   const handleLogout = () => {
    ObrišiVrednostPoKljuču("authToken");
    logout();
  };

  useEffect(() => {
    (async () => {
      const data = await usersApi.getSviKorisnici(token ?? "");
      const korisnici = data.filter(korisnik => korisnik.uloga === "user");
      setKorisnici(korisnici);
    })();
  }, [token, usersApi]);

  return (
    <div>
      <div className="profil-ikona">
        <Link to="/profil" title="Moj profil">
          <img
          src={defaultAvatar} //user?.slikaUrl || defaultAvatar
          alt="Profil"
        />
        </Link>
      </div>
      <h2>
        Контакти
      </h2>
      <table>
        <thead>
          <tr>
            <th >ID</th>
            <th>Корисничко име</th>
            <th>Улога</th>
          </tr>
        </thead>
        <tbody>
          {korisnici.length > 0 ? (
            korisnici.map((korisnik) => (
              <RedUTabeliKorisnika key={korisnik.id} korisnik={korisnik} />
            ))
          ) : (
            <tr>
              <td colSpan={3}>
                Нема корисника за приказ.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={handleLogout}
      >
        Напусти контакте
      </button>
    </div>
  );
}
