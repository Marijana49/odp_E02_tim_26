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
  const [slikaFile, setSlikaFile] = useState<File | null>(null);
  const [slikaPreview, setSlikaPreview] = useState<string>("");

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
      let slikaZaSlanje = slika;

    // Ako postoji data URL, skini prefix
    if (slika.startsWith("data:image/")) {
      const parts = slika.split(",");
      if (parts.length === 2) {
        slikaZaSlanje = parts[1]; // uzmi samo Base64 dio
      }
    }
      const noviPodaci: UserDto = {
        id: user.id,
        ime,
        prezime,
        brTelefona,
        slika: slika,
        korisnickoIme: user.korisnickoIme,
        uloga: user.uloga
      };

      const odgovor = await usersApi.updateKorisnik(token ?? "", noviPodaci);
      console.log(noviPodaci);

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
            name="slika"
            accept="image/*"
            onChange={(e) => {
              if(e.target.files?.[0]){
                const file = e.target.files[0];
                setSlikaFile(file);

                const previewUrl = URL.createObjectURL(file);
                setSlikaPreview(previewUrl);

                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result as string;
                  setSlika(base64String);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {slikaFile ? (
            <img
              src={slikaPreview}
              alt="Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          ) : slika ? (
            <img
              src={slika}
              alt="Profilna slika"
              style={{ maxWidth: "200px", marginTop: "10px" }}
              onError={(e) => {
                e.currentTarget.src = "/defaultProfilePicture.jpg";
              }}
            />
          ) : null}
          {greska && <p>{greska}</p>}
          <br></br>
          <button type="submit" className="btn">Сачувај измјене</button>
          <button className="btn btn-nazad">Назад на профил</button>
        </form>
      )}
    </div>
  );
};
