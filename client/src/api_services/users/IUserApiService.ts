import type { UserDto } from "../../models/users/UserDTO";

/**
 * Interfejs za korisnicki servis.
 */
export interface IUsersAPIService {
    getSviKorisnici(token: string): Promise<UserDto[]>;
    updateKorisnik(token: string, podaci: UserDto) : Promise<boolean>;
    getKorisnikById(token: string, id: number) : Promise<UserDto | null>;
    uploadSlika(token: string, file: File): Promise<string>;
}