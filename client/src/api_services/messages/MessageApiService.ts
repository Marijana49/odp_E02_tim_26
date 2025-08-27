import axios from "axios";
import type { IMessageAPIService } from "./IMessageApiService";
import type { MessageDto } from "../../models/messages/MessageDTO";
import type { Poruka } from "../../../../server/src/Domain/models/Poruka";

const API_URL: string = import.meta.env.VITE_API_URL + "messages";

export const MessagesApi: IMessageAPIService = {
  async getSvePoruke(token: string): Promise<MessageDto[]> {
    try {
      const res = await axios.get<MessageDto[]>(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch {
      return [];
    }
  },

  async updatePoruke(token: string, podaci: MessageDto): Promise<boolean> {
    try {
      await axios.put(`${API_URL}/update`, podaci, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      console.error("Error updating poruke:", error);
      return false;
    }
  },

  async posaljiPoruku(poruka: Poruka, token: string): Promise<Poruka> {
  try {
    const res = await axios.post<Poruka>(`${API_URL}`, poruka, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Greška pri slanju poruke:", error);
    throw error;
  }
}
};
