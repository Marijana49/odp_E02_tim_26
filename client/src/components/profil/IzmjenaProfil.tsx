import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/UseAuthHook";
import type { IUsersAPIService } from "../../api_services/users/IUserApiService";
import type { UserDto } from "../../models/users/UserDTO";

interface IzmjenaProfilProps {
  usersApi: IUsersAPIService;
}

export const IzmjenaProfil = ({ usersApi }: IzmjenaProfilProps) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [ime, setIme] = useState<string>("");
  const [prezime, setPrezime] = useState<string>("");
  const [brTelefona, setBrTelefona] = useState<string>("");
  const [slika, setSlika] = useState<string>("");
  const [greska, setGreska] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [slikaFIle, setSlikaFile] = useState<File | null>(null);

  useEffect(() => {
    if (user?.id && token) {
      const fetchUserData = async () => {
        try {
          const data = await usersApi.getKorisnikById(token, user.id);
          console.log(data)
          if (data) {
            setIme(data.ime);
            setPrezime(data.prezime);
            setBrTelefona(data.brTelefona);
            setSlika(data.slika);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [user, token, usersApi]);

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setGreska("Недостаје ID корисника.");
      return;
    }

    try {
      const noviPodaci: UserDto = {
        id: user.id,
        ime,
        prezime,
        brTelefona,
        slika,
        korisnickoIme: user.korisnickoIme,
        uloga: user.uloga
      };

      const odgovor = await usersApi.updateKorisnik(token ?? "", noviPodaci);

      if (odgovor) {
        navigate("/profil");
      } else {
        setGreska("Дошло је до грешке при ажурирању.");
      }
    } catch {
      setGreska("Грешка на серверу.");
    }
  };

  return (
    <div>
      <h1>Измјена профила</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={podnesiFormu}>
          <input
            type="text"
            placeholder="Име"
            name="ime"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
          />
          <input
            type="text"
            placeholder="Презиме"
            value={prezime}
            name="prezime"
            onChange={(e) => setPrezime(e.target.value)}
          />
          <input
            type="text"
            placeholder="Број телефона"
            value={brTelefona}
            name="brTel"
            onChange={(e) => setBrTelefona(e.target.value)}
          />
          <input
            type="file"
            placeholder="Профилна слика"
            name="slika"
            accept="image/*"
            onChange={(e) => {
              if(e.target.files && e.target.files.length > 0){
                const file = e.target.files[0];
                setSlikaFile(file);

                const imageUrl = URL.createObjectURL(file);
                setSlika(imageUrl);
              }
            }}
          />
          {slika && <img src={slika} alt="Preview" style={{maxWidth: "200px", marginTop: "10px"}}/>}
          {greska && <p>{greska}</p>}
          <br></br>
          <button type="submit" className="btn">Сачувај измјене</button>
          <button className="btn btn-nazad">Назад на профил</button>
        </form>
      )}
    </div>
  );
};
