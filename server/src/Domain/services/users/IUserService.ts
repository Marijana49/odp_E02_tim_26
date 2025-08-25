import { UserDto } from "../../DTOs/users/UserDto";

export interface IUserService {
  getSviKorisnici(): Promise<UserDto[]>;
  azurirajKorisnika(dto: UserDto): Promise<UserDto | null>
  getKorisnikById(id: number): Promise<UserDto | null>;
}