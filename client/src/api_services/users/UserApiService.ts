import axios from "axios";
import type { UserDto } from "../../models/users/UserDTO";
import type { IUsersAPIService } from "./IUserApiService";

const API_URL: string = import.meta.env.VITE_API_URL + "user";

export const usersApi: IUsersAPIService = {
  async getSviKorisnici(token: string): Promise<UserDto[]> {
    try {
      const res = await axios.get<UserDto[]>(`${API_URL}s`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch {
      return [];
    }
  },
};
