import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { IUserService } from "../../Domain/services/users/IUserService";

export class UserService implements IUserService {
  public constructor(private userRepository: IUserRepository) {}

  async getKorisnikById(id: number): Promise<UserDto | null> {
    return await this.userRepository.getById(id);
  }

  async getSviKorisnici(): Promise<UserDto[]> {
    const korisnici: User[] = await this.userRepository.getAll();
    const korisniciDto: UserDto[] = korisnici.map(
      (user) => new UserDto(user.id, user.korisnickoIme, user.uloga)
    );

    return korisniciDto;
  }

  async azurirajKorisnika(dto: UserDto): Promise<UserDto | null> {
    const postojeci = await this.userRepository.getById(dto.id);
    if (!postojeci.id) return null;

    postojeci.ime = dto.ime ?? postojeci.ime;
    postojeci.prezime = dto.prezime ?? postojeci.prezime;
    postojeci.brTelefona = dto.brTelefona ?? postojeci.brTelefona;
    postojeci.slika = dto.slika ?? postojeci.slika;

    const azuriran = await this.userRepository.update(postojeci);

    if (!azuriran.id) return null;

    return {
      id: azuriran.id,
      korisnickoIme: azuriran.korisnickoIme,
      uloga: azuriran.uloga,
      ime: azuriran.ime,
      prezime: azuriran.prezime,
      brTelefona: azuriran.brTelefona,
      slika: azuriran.slika,
    };
  }
}
