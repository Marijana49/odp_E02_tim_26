import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth/UseAuthHook";
import { Link } from "react-router-dom";
import type { IUsersAPIService } from "../../api_services/users/IUserApiService";
import type { UserDto } from "../../models/users/UserDTO";

interface ProfilProps {
  usersApi: IUsersAPIService;
}

export function Profil({ usersApi }: ProfilProps) {
  const { user, token } = useAuth();
  const [userData, setUserData] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id && token) {
        try {
          const data = await usersApi.getKorisnikById(token, user.id);
          if(data !== null) 
            setUserData(data);  
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false); 
        }
      }
    };
    fetchUserData();
  }, [user?.id, token, usersApi]);

  return (
    <div className="form-container">
      <h2>Профил</h2>

      {loading ? (
        <p>Loading...</p>
      ) : userData ? (
        <>
          <div className="profile-image-row">
            <p>Профилна слика:</p>
            <img
              src={userData.slike ? userData.slike : "/defaultProfilePicture.jpg"}
              alt="Профилна слика"
              onError={(e) => (e.currentTarget.src = "/defaultProfilePicture.jpg")}
              style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
            />
          </div>

          <p>Корисничко име: {userData?.korisnickoIme}</p>
          <p>Име: {userData?.ime}</p>
          <p>Презиме: {userData?.prezime}</p>
          <p>Број телефона: {userData?.brTelefona}</p>
        </>
      ) : (
        <p>Нема података о кориснику.</p>
      )}

      <div className="btn-group" style={{ marginTop: "20px" }}>
        {(user?.uloga === "admin" || user?.uloga === "user") && (
          <Link to={user.uloga === "admin" ? "/admin-dashboard" : "/user-dashboard"}>
            <button className="btn btn-nazad">Назад на контакте</button>
          </Link>
        )}

        <Link to="/Izmjenaprofila">
          <button className="btn" style={{ marginLeft: "10px" }}>
            Измјени профил
          </button>
        </Link>
      </div>
    </div>
  );
}

