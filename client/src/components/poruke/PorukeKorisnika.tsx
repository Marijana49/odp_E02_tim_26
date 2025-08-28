import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Poruka } from '../../../../server/src/Domain/models/Poruka';
import { PorukaEnum } from '../../../../server/src/Domain/enums/PorukaEnum';
import { useAuth } from '../../hooks/auth/UseAuthHook';
import { usersApi } from "../../api_services/users/UserApiService";
import { MessagesApi } from '../../api_services/messages/MessageApiService';

function PorukeKorisnika() {
  const { id } = useParams<{ id: string }>();
  const [poruke, setPoruke] = useState<Poruka[]>([]);
  const [novaPoruka, setNovaPoruka] = useState('');
  const [kontakt, setKontakt] = useState('');
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && token) {
      const fetchContact = async () => {
        try {
          const data = await usersApi.getKorisnikById(token, parseInt(id));
          if (data) {
            setKontakt(data.korisnickoIme);
          }
        } catch (error) {
          console.error("Greška pri dobavljanju kontakta:", error);
        }
      };
      fetchContact();
    }
  }, [id, token]);

  // Dohvatanje svih poruka između usera i kontakta
  const fetchPoruke = async () => {
    if (!token || !user || !kontakt) return;

    try {
      const svePoruke = await MessagesApi.getSvePoruke(token);
      const filtrirane = svePoruke.filter(p =>
        (p.posiljalac === user.korisnickoIme && p.primalac === kontakt) ||
        (p.posiljalac === kontakt && p.primalac === user.korisnickoIme)
      );

      const neprocitane = filtrirane.filter(p => p.posiljalac === kontakt && p.primalac === user.korisnickoIme && p.stanje === PorukaEnum.Poslato);

    // Pozovi update za svaku takvu poruku
    for (const poruka of neprocitane) {
      try {
        const azuriranaPoruka = { ...poruka, stanje: PorukaEnum.Procitano};
        await MessagesApi.updatePoruke(token, azuriranaPoruka);
      } catch (err) {
        console.error("Greška pri ažuriranju statusa poruke:", err);
      }
    }

    const azuriranePoruke = filtrirane.map(p => {
      if ( p.posiljalac === kontakt && p.primalac === user.korisnickoIme && p.stanje === PorukaEnum.Poslato) {
        return { ...p, stanje: PorukaEnum.Procitano };
      }
      return p;
    });

      setPoruke(azuriranePoruke);
    } catch (err) {
      console.error("Greška pri učitavanju poruka:", err);
    }
  };

  useEffect(() => {
    fetchPoruke();

    const interval = setInterval(fetchPoruke, 5000);
    return () => clearInterval(interval);
  }, [token, user, kontakt]);

  const posaljiOvuPoruku = async () => {
    if (novaPoruka.trim() === '' || !user || !kontakt) return;

    const nova = new Poruka(
      user.korisnickoIme,
      kontakt,
      novaPoruka,
      PorukaEnum.Poslato,
    );

    try {
      await MessagesApi.posaljiPoruku(nova, token ?? "");
      setNovaPoruka('');
      await fetchPoruke(); // Osveži odmah
    } catch (error) {
      console.error('Greška pri slanju poruke:', error);
    }
  };

  const brojNeprocitanihPoKontaktu = async () => {
  if (!token || !user) return;

  try {
    const svePoruke = await MessagesApi.getSvePoruke(token);

    const neprocitanePoruke = svePoruke.filter(p =>
      p.primalac === user.korisnickoIme &&
      p.stanje === PorukaEnum.Poslato
    );

    // Grupisanje po kontaktima
    const brojPoKontaktu: Record<string, number> = {};

    for (const poruka of neprocitanePoruke) {
      if (!brojPoKontaktu[poruka.primalac]) {
        brojPoKontaktu[poruka.primalac] = 1;
      } else {
        brojPoKontaktu[poruka.primalac]++;
      }
    }
    return brojPoKontaktu;
    } catch (err) {
      console.error("Greška pri brojanju nepročitanih poruka:", err);
    }
  };
  return (
    <div className="messenger-container">
      <h2>Поруке са корисником {kontakt}</h2>

      <div className="poruke-box">
        {poruke.map((poruka, index) => {
          const jeMoja = poruka.posiljalac === user?.korisnickoIme;

          return (
            <div
              key={index}
              className={`poruka ${jeMoja ? 'moja' : 'njihova'}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{poruka.tekst}</span>
                <span style={{ fontSize: "0.8em", color: poruka.stanje === PorukaEnum.Procitano ? 'blue' : 'gray' }}>
                  {jeMoja ? (poruka.stanje === PorukaEnum.Procitano ? '✔✔' : '✔') : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="input-box">
        <input
          type="text"
          value={novaPoruka}
          onChange={(e) => setNovaPoruka(e.target.value)}
          placeholder="Упиши поруку..."
        />
        <button onClick={posaljiOvuPoruku}>Пошаљи</button>
        <button onClick={() => navigate(-1)} className="exit-button">Изађи</button>
      </div>
    </div>
  );
}

export default PorukeKorisnika;
