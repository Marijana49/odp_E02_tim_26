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
          console.log(data);
          if (data) {
            setIme(data.ime);
            setPrezime(data.prezime);
            setBrTelefona(data.brTelefona);
            setSlika(data.slike);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSlikaFile(file);

      const previewUrl = URL.createObjectURL(file);
      setSlikaPreview(previewUrl);

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const MAX_WIDTH = 200; // max širina
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Kompresija u base64 JPEG (30% kvaliteta)
          const compressedBase64 = canvas.toDataURL("image/png", 0.5);
          setSlika(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

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
        slike: slika,
        korisnickoIme: user.korisnickoIme,
        uloga: user.uloga,
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
            onChange={handleImageChange}
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
          <br />
          <button type="submit" className="btn">
            Сачувај измјене
          </button>
          <button
            type="button"
            className="btn btn-nazad"
            onClick={() => navigate("/profil")}
          >
            Назад на профил
          </button>
        </form>
      )}
    </div>
  );
};
