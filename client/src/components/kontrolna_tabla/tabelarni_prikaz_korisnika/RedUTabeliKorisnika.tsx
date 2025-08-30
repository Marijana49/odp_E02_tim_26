import { Link } from "react-router-dom";
import type { UserBaseInfoDto } from "../../../models/users/UserBaseInfoDTO";

interface RedUTabeliKorisnikaProps {
  korisnik: UserBaseInfoDto;
  neprocitane: number;
}

export function RedUTabeliKorisnika({ korisnik, neprocitane }: RedUTabeliKorisnikaProps) {
  return (
    <tr>
      <td>{korisnik.id}</td>
      <td>
        <Link 
          to={`/korisnik/${korisnik.id}`} 
          title={`Прикажи поруке са контактом ${korisnik.korisnickoIme}`}
        >
          {korisnik.korisnickoIme}
        </Link>
      </td>
      <td>{korisnik.uloga}</td>
      <td>{neprocitane}</td>
    </tr>
  );
}
