import axios from "axios";

export async function updateUser(podaci: {
  id: number;
  ime: string;
  prezime: string;
  brTelefona: string;
  slika: string;
}) {
  try {
    const response = await axios.put("/api/v1/users/update", podaci);
    return response.data;
  } catch (error) {
    return { success: false, message: "Грешка на серверу." };
  }
}
