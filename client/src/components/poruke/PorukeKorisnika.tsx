import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Poruka } from '../../../../server/src/Domain/models/Poruka';
import { PorukaEnum } from '../../../../server/src/Domain/enums/PorukaEnum';
import { useAuth } from '../../hooks/auth/UseAuthHook';
import type { IUsersAPIService } from '../../api_services/users/IUserApiService';
import type { IMessageAPIService } from '../../api_services/messages/IMessageApiService';

interface PorukeKorisnikaProps{
  usersApi: IUsersAPIService;
  messagesApi: IMessageAPIService;
}

function PorukeKorisnika({usersApi, messagesApi}: PorukeKorisnikaProps) {
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
  }, [id, token, usersApi]);

  const fetchPoruke = async () => {
    if (!token || !user || !kontakt) return;

    try {
      const svePoruke = await messagesApi.getSvePoruke(token);
      const filtrirane = svePoruke.filter(p =>
        (p.posiljalac === user.korisnickoIme && p.primalac === kontakt) ||
        (p.posiljalac === kontakt && p.primalac === user.korisnickoIme)
      );
      const neprocitane = filtrirane.filter(p => p.posiljalac === kontakt && p.primalac === user.korisnickoIme && p.stanje === PorukaEnum.Poslato);

    for (const poruka of neprocitane) {
      try {
        const azuriranaPoruka = { ...poruka, stanje: PorukaEnum.Procitano};
        console.log("Ažuriram poruku:", azuriranaPoruka);
        await messagesApi.updatePoruke(token, azuriranaPoruka);
      } catch (err) {
        console.error("Greška pri ažuriranju statusa poruke:", err);
      }
    }

    //const azuriranePoruke = filtrirane.map(p => { return p;});
    setPoruke(filtrirane);
    //setPoruke(azuriranePoruke);
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
      0,
      user.korisnickoIme,
      kontakt,
      novaPoruka,
      PorukaEnum.Poslato,
    );

    try {
      await messagesApi.posaljiPoruku(nova, token ?? "");
      setNovaPoruka('');
      await fetchPoruke();
    } catch (error) {
      console.error('Greška pri slanju poruke:', error);
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
