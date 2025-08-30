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

export function TabelaAdmin({ usersApi }: TabelaKorisnikaProps) {
  const [korisnici, setKorisnici] = useState<UserBaseInfoDto[]>([]);
  const [korisnik, setKorisnik] = useState<UserDto | null>();
  const { token, logout, user } = useAuth();
  const [neprocitanePoruke, setNeprocitanePoruke] = useState<{
    [korisnikId: number]: number;
  }>({});

  const handleLogout = () => {
    logout();
  };

  // funkcija koja osvežava korisnike i poruke
  const fetchData = async () => {
    if (!token || !user?.id) return;

    const data = await usersApi.getSviKorisnici(token);
    const trenutni = await usersApi.getKorisnikById(token, user.id);
    const admini = data.filter((korisnik) => korisnik.uloga === "admin");

    setKorisnici(admini);
    setKorisnik(trenutni);

    const svePoruke = await MessagesApi.getSvePoruke(token);

    const brojevi: { [korisnikId: number]: number } = {};
    for (const admin of admini) {
      const kontaktIme = admin.korisnickoIme;
      if (trenutni) {
        const neprocitane = svePoruke.filter(
          (p) =>
            p.posiljalac === kontaktIme &&
            p.primalac === trenutni.korisnickoIme &&
            p.stanje === 1
        );
        brojevi[admin.id] = neprocitane.length;
      }
    }
    setNeprocitanePoruke(brojevi);
  };

  useEffect(() => {
    fetchData(); // odmah pozovi na mount

    const interval = setInterval(() => {
      fetchData();
    }, 5000); // svakih 5 sekundi

    return () => clearInterval(interval); // očisti interval kada se unmount-uje
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.id, usersApi]);

  return (
    <div className="admin-container">
      {/* Header */}
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

      {/* Kontakti */}
      <h3>Контакти</h3>
      <table className="admin-table">
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

      {/* Logout dugme */}
      <button onClick={handleLogout} className="logout-btn">
        Напусти контакте
      </button>
    </div>
  );
}
