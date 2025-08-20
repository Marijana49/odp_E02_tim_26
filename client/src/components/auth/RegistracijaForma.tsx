import { useState } from "react";
import { Link } from "react-router-dom";
import { validacijaPodatakaAuth } from "../../api_services/validatori/auth/AuthValidatori";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { useAuth } from "../../hooks/auth/UseAuthHook";

export function RegistracijaForma({ authApi }: AuthFormProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [uloga, setUloga] = useState("user");
  const [greska, setGreska] = useState("");
  const { login } = useAuth();

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Неисправни подаци");
      return;
    }

    const odgovor = await authApi.registracija(korisnickoIme, lozinka, uloga);
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
      <h1>Регистрација</h1>
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
        <select
          value={uloga}
          onChange={(e) => setUloga(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {greska && <p>{greska}</p>}
        <button
          type="submit"
        >
          Региструј се
        </button>
      </form>
      <p>
        Већ имате налог?{" "}
        <Link to="/login">
          Пријавите се
        </Link>
      </p>
    </div>
  );
}
