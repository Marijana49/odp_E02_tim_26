import { Link } from "react-router-dom";
import type { UserDto } from "../../../models/users/UserDTO";

interface RedUTabeliKorisnikaProps {
  korisnik: UserDto;
}

export function RedUTabeliKorisnika({ korisnik }: RedUTabeliKorisnikaProps) {
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
    </tr>
  );
}
