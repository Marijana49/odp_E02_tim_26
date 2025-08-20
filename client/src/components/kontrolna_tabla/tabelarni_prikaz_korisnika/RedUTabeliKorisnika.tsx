import { Link } from "react-router-dom";
import type { UserDto } from "../../../models/users/UserDTO";

interface RedUTabeliKorisnikaProps {
  korisnik: UserDto;
}

export function RedUTabeliKorisnika({ korisnik }: RedUTabeliKorisnikaProps) {
  return (
    <tr>
      <td>{korisnik.id}</td>
      <Link to={`/korisnik/${korisnik.id}`}>{korisnik.korisnickoIme}</Link>
      <td>{korisnik.uloga}</td>
    </tr>
  );
}
