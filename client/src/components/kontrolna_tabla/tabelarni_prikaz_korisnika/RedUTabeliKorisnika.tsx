import type { UserDto } from "../../../models/users/UserDTO";

interface RedUTabeliKorisnikaProps {
  korisnik: UserDto;
}

export function RedUTabeliKorisnika({ korisnik }: RedUTabeliKorisnikaProps) {
  return (
    <tr>
      <td>{korisnik.id}</td>
      <td>{korisnik.korisnickoIme}</td>
      <td>{korisnik.uloga}</td>
    </tr>
  );
}
