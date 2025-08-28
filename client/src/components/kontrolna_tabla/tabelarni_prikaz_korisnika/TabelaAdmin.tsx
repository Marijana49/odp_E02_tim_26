import { useEffect, useState } from "react";
import type { IUsersAPIService } from "../../../api_services/users/IUserApiService";
import type { UserBaseInfoDto } from "../../../models/users/UserBaseInfoDTO";
import { RedUTabeliKorisnika } from "./RedUTabeliKorisnika";
import { useAuth } from "../../../hooks/auth/UseAuthHook";
import { ObrišiVrednostPoKljuču } from "../../../helpers/LocalStorage";
import { Link } from "react-router-dom";
import defaultAvatar from "../../../assets/defaultProfilePicture.jpg";
import type { UserDto } from "../../../models/users/UserDTO";
import { MessagesApi } from "../../../api_services/messages/MessageApiService";
import { PorukaEnum } from "../../../../../server/src/Domain/enums/PorukaEnum";


interface TabelaKorisnikaProps {
  usersApi: IUsersAPIService;
}

export function TabelaAdmin({ usersApi }: TabelaKorisnikaProps) {
  const [korisnici, setKorisnici] = useState<UserBaseInfoDto[]>([]);
  const [korisnik, setKorisnik] = useState<UserDto | null>();
  const { token, logout, user } = useAuth();
  const [neprocitanePoruke, setNeprocitanePoruke] = useState<{ [korisnikId: number]: number }>({});


   const handleLogout = () => {
    ObrišiVrednostPoKljuču("authToken");
    logout();
  };

  useEffect(() => {
    (async () => {
      const data = await usersApi.getSviKorisnici(token ?? "");
      const trenutni = await usersApi.getKorisnikById(token ?? "", user?.id ?? 0);
      const admini = data.filter(korisnik => korisnik.uloga === "admin");
      /*const adminiSaBrojemPoruka = admini.map(admin => ({...admin, brPoruka: brojevi[admin.id] ?? 0}));
      setKorisnici(adminiSaBrojemPoruka);*/
      setKorisnici(admini);
      setKorisnik(trenutni);

      const svePoruke = await MessagesApi.getSvePoruke(token ?? "");

    // Kreiraj mapu nepročitanih poruka po ID-u korisnika
    const brojevi: { [korisnikId: number]: number } = {};

    for (const admin of admini) {
      const kontaktIme = admin.korisnickoIme;
      if(trenutni)
      {
        const neprocitane = svePoruke.filter(p =>
        p.ulogovani === kontaktIme &&                            // Poruku je poslao taj korisnik
        p.korIme === trenutni.korisnickoIme &&                  // Ulogovani je primio poruku
        p.stanje === PorukaEnum.Poslato);                         // Poruka nije pročitana
        brojevi[admin.id] = neprocitane.length;
      }
    }

    setNeprocitanePoruke(brojevi);
    })();
  }, [token, user?.id, usersApi]);

  return (
    <div>
      <div className="profil-ikona">
        <Link to="/profil" title="Мој профил">
          <img
          src={(korisnik === null || korisnik?.slike == null) ? defaultAvatar : korisnik?.slike} 
          alt="Профил"
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
            <th>Непрочитане поруке</th>
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
