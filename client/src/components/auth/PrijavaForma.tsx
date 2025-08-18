import { useState } from "react";
import { Link } from "react-router-dom";
import { validacijaPodatakaAuth } from "../../api_services/validatori/auth/AuthValidatori";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { useAuth } from "../../hooks/auth/UseAuthHook";

export function PrijavaForma({ authApi }: AuthFormProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const { login } = useAuth();

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Неисправни подаци");
      return;
    }

    const odgovor = await authApi.prijava(korisnickoIme, lozinka);
    if (odgovor.success && odgovor.data) {
      login(odgovor.data);
    } else {
      setGreska(odgovor.message);
      setKorisnickoIme("");
      setLozinka("");
    }
  };

  return (
    <div>
      <h1>Пријава</h1>
      <form onSubmit={podnesiFormu}>
        <input
          type="text"
          placeholder="Корисничко име"
          value={korisnickoIme}
          onChange={(e) => setKorisnickoIme(e.target.value)}
        />
        <input
          type="password"
          placeholder="Лозинка"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
        />
        {greska && <p>{greska}</p>}
        <button
          type="submit"
          className="w-full bg-blue-700/70 hover:bg-blue-700/90 text-white py-2 rounded-xl transition"
        >
          Пријави се
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Немате налог?{" "}
        <Link to="/register" className="text-blue-700 hover:underline">
          Региструјте се
        </Link>
      </p>
    </div>
  );
}
