import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/UseAuthHook";
import { updateUser } from "../../api_services/users/UpdateUser"; 

export function IzmjenaProfila() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [ime, setIme] = useState(user?.ime ?? "");
  const [prezime, setPrezime] = useState(user?.prezime ?? "");
  const [brTelefona, setBrTelefona] = useState(user?.brTelefona ?? "");
  const [slika, setSlika] = useState(user?.slika ?? "");
  const [greska, setGreska] = useState("");

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const noviPodaci = {
        korisnickoIme: user?.korisnickoIme,
        ime,
        prezime,
        brTelefona,
        slika,
      };

      const odgovor = await updateUser(noviPodaci); // Poziv ka API-ju

      if (odgovor.success && odgovor.data) {
        login(odgovor.data); // Ažuriraj auth kontekst
        navigate("/profil");
      } else {
        setGreska(odgovor.message || "Дошло је до грешке при ажурирању.");
      }
    } catch (err) {
      setGreska("Грешка на серверу.");
    }
  };

  return (
    <div>
      <h1>Измјена профила</h1>
      <form onSubmit={podnesiFormu}>
        <input
          type="text"
          placeholder="Име"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
        />
        <input
          type="text"
          placeholder="Презиме"
          value={prezime}
          onChange={(e) => setPrezime(e.target.value)}
        />
        <input
          type="text"
          placeholder="Број телефона"
          value={brTelefona}
          onChange={(e) => setBrTelefona(e.target.value)}
        />
        <input
          type="text"
          placeholder="Линк до слике"
          value={slika}
          onChange={(e) => setSlika(e.target.value)}
        />
        {greska && <p>{greska}</p>}
        <button type="submit">Сачувај измјене</button>
      </form>
    </div>
  );
}
