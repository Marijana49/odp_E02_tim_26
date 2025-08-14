import type { UserDto } from "../../models/users/UserDTO";

/**
 * Interfejs za korisnicki servis.
 */
export interface IUsersAPIService {
    getSviKorisnici(token: string): Promise<UserDto[]>;
}