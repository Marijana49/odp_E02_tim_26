// Primer TypeScript API poziva
export async function updateUser(userData: any) {
  try {
    const res = await fetch(`/api_services/users/${userData.korisnickoIme}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    return { success: res.ok, data, message: data.message };
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}
