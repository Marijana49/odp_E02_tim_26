import { useAuth } from "../../hooks/auth/UseAuthHook";

// Primer komponenta 
//ovde jos dodati kad se prosiri baza ime, pr, za sliku link itd
export function Profil() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Profil</h2>
      <p>Korisničko ime: {user?.korisnickoIme}</p> 
    </div>
  );
}
