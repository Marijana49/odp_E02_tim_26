import axios from "axios";
import type { IUsersAPIService } from "./IUserApiService";
import type { UserDto } from "../../models/users/UserDTO";

const API_URL: string = import.meta.env.VITE_API_URL + "users";

export const usersApi: IUsersAPIService = {
  async getSviKorisnici(token: string): Promise<UserDto[]> {
    try {
      const res = await axios.get<UserDto[]>(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch {
      return [];
    }
  },

  async updateKorisnik(token: string, podaci: UserDto): Promise<boolean> {
    try {
      await axios.put(`${API_URL}/update`, podaci, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      console.error("Error updating korisnik:", error);
      return false;
    }
  },
  
  async getKorisnikById(
    token: string,
    userId: number
  ): Promise<UserDto | null> {
    try {
      const res = await axios.get<UserDto>(`${API_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  },
};
