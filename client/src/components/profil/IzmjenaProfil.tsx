import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/UseAuthHook";
import { updateUser } from "../../api_services/users/UpdateUser"; 

export function IzmjenaProfil() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [ime, setIme] = useState(user?.ime ?? "");
  const [prezime, setPrezime] = useState(user?.prezime ?? "");
  const [brTelefona, setBrTelefona] = useState(user?.brTelefona ?? "");
  const [slika, setSlika] = useState(user?.slika ?? "");
  const [greska, setGreska] = useState("");

  const podnesiFormu = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user?.id) {
    setGreska("Недостаје ID корисника.");
    return;
  }

  try {
    const noviPodaci = {
      id: user.id,
      ime,
      prezime,
      brTelefona,
      slika,
    };

    const odgovor = await updateUser(noviPodaci);

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
          type="text"
          placeholder="Линк до слике"
          value={slika}
          name="slika"
          onChange={(e) => setSlika(e.target.value)}
        />
        {greska && <p>{greska}</p>}
        <button type="submit">Сачувај измјене</button>
      </form>
    </div>
  );
}
