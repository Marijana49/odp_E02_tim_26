import axios from "axios";
import type { IMessageAPIService } from "./IMessageApiService";
import type { MessageDto } from "../../models/messages/MessageDTO";

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

};
