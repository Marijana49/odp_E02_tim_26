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

export function TabelaKorisnika({ usersApi }: TabelaKorisnikaProps) {
  const [korisnici, setKorisnici] = useState<UserBaseInfoDto[]>([]);
  const { token, logout, user } = useAuth();
  const [korisnik, setKorisnik] = useState<UserDto | null>(null);

  const handleLogout = () => {
    ObrišiVrednostPoKljuču("authToken");
    logout();
  };

  useEffect(() => {
    (async () => {
      const data = await usersApi.getSviKorisnici(token ?? "");
      const trenutni = await usersApi.getKorisnikById(token ?? "", user?.id ?? 0);
      const kontakti = data.filter(korisnik => korisnik.uloga === "user");
      setKorisnik(trenutni);

      const svePoruke = await MessagesApi.getSvePoruke(token ?? "");

      const brojevi: { [korisnikId: number]: number } = {};

      for (const kor of kontakti) {
        const kontaktIme = kor.korisnickoIme;
        if (trenutni) {
          const neprocitane = svePoruke.filter(p =>
            p.posiljalac === kontaktIme &&
            p.primalac === trenutni.korisnickoIme &&
            p.stanje === PorukaEnum.Poslato
          );
          brojevi[kor.id] = neprocitane.length;
        }
      }

      const kontaktiSaBrojem = kontakti.map(k => ({
        ...k,
        brPoruka: brojevi[k.id] || 0
      }));

      setKorisnici(kontaktiSaBrojem);
    })();
  }, [token, usersApi]);

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
      <h2>Контакти</h2>
      <table>
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
              <RedUTabeliKorisnika key={korisnik.id} korisnik={korisnik} />
            ))
          ) : (
            <tr>
              <td colSpan={4}>Нема корисника за приказ.</td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={handleLogout}>Напусти контакте</button>
    </div>
  );
}

