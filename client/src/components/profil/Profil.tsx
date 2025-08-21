import { useAuth } from "../../hooks/auth/UseAuthHook";
import { Link } from "react-router-dom"; 

export function Profil() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Профил</h2>
      <p>Корисничко име: {user?.korisnickoIme}</p>
      <p>Профилна слика: {user?.slika}</p>
      <p>Број телефона: {user?.brTelefona}</p>  
      <p>Име: {user?.ime}</p>  
      <p>Презиме: {user?.prezime}</p>    

      <div style={{ marginTop: "20px" }}>
        {user?.uloga === "admin" ? (
          <Link to="/admin-dashboard">
            <button>Назад на контакте</button>
          </Link>
        ) : user?.uloga === "user" ? (
          <Link to="/user-dashboard">
            <button>Назад на контакте</button>
          </Link>
        ) : null}
        <Link to="/Izmjenaprofila">
          <button style={{ marginLeft: "10px" }}>Измјени профил</button>
        </Link>
      </div>
    </div>
  );
}
