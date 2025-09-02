import { useEffect, useState } from "react";
import type { IUsersAPIService } from "../../../api_services/users/IUserApiService";
import type { UserBaseInfoDto } from "../../../models/users/UserBaseInfoDTO";
import { RedUTabeliKorisnika } from "./RedUTabeliKorisnika";
import { useAuth } from "../../../hooks/auth/UseAuthHook";
import { Link } from "react-router-dom";
import defaultAvatar from "../../../assets/defaultProfilePicture.jpg";
import type { UserDto } from "../../../models/users/UserDTO";
import { MessagesApi } from "../../../api_services/messages/MessageApiService";

interface TabelaKorisnikaProps {
  usersApi: IUsersAPIService;
}

export function TabelaKorisnika({ usersApi }: TabelaKorisnikaProps) {
  const [korisnici, setKorisnici] = useState<UserBaseInfoDto[]>([]);
  const [korisnik, setKorisnik] = useState<UserDto | null>();
  const { token, logout, user } = useAuth();
  const [neprocitanePoruke, setNeprocitanePoruke] = useState<{
    [korisnikId: number]: number;
  }>({});

  const handleLogout = () => {
    logout();
  };

  const fetchData = async () => {
    if (!token || !user?.id) return;

    const data = await usersApi.getSviKorisnici(token);
    const trenutni = await usersApi.getKorisnikById(token, user.id);
    const useri = data.filter((korisnik) => korisnik.uloga === "user");

    setKorisnici(useri);
    setKorisnik(trenutni);

    const svePoruke = await MessagesApi.getSvePoruke(token);

    const brojevi: { [korisnikId: number]: number } = {};
    for (const u of useri) {
      const kontaktIme = u.korisnickoIme;
      if (trenutni) {
        const neprocitane = svePoruke.filter(
          (p) =>
            p.posiljalac === kontaktIme &&
            p.primalac === trenutni.korisnickoIme &&
            p.stanje === 1
        );
        brojevi[u.id] = neprocitane.length;
      }
    }
    setNeprocitanePoruke(brojevi);
  };

  useEffect(() => {
    fetchData(); 

   const interval = setInterval(() => {
      fetchData();
    }, 5000);

   return () => clearInterval(interval);
  }, [token, user?.id, usersApi]);

  return (
     <div className="kor-container">
      <div className="header-bar">
        <h2>Здраво, {korisnik?.korisnickoIme}</h2>
        <Link to="/profil" title="Мој профил">
          <img
            src={
              korisnik === null || korisnik?.slike == null
                ? defaultAvatar
                : korisnik?.slike
            }
            alt="Профил"
          />
        </Link>
      </div>

      <h3>Контакти</h3>
      <table className="kor-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Корисничко име</th>
            <th>Улога</th>
            <th>Непрочитане поруке</th>
          </tr>
        </thead>
        <tbody>
          {korisnici.length > 0 ? (
            korisnici.map((korisnik) => (
              <RedUTabeliKorisnika
                key={korisnik.id}
                korisnik={korisnik}
                neprocitane={neprocitanePoruke[korisnik.id]}
              />
            ))
          ) : (
            <tr>
              <td colSpan={4}>Нема корисника за приказ.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={handleLogout} className="logout-btn">
        Напусти контакте
      </button>
    </div>
  );
}

