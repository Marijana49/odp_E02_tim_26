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
  const [kontakt, setKontakt] = useState(''); // kontakt koji komunicira sa userom
  const { user, token } = useAuth(); // moj ulogovani user
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
          console.error("Greška pri dobavljanju korisnika iz kontakta:", error);
        }
      }
      fetchContact();
    }
  }, [id, token, usersApi]);

  useEffect(() => {
    if (!token || !user || !kontakt) return;

    const fetchPoruke = async () => {
      try {
        const svePoruke = await MessagesApi.getSvePoruke(token);

        console.log("Sve poruke sa servera:", svePoruke);

        const filtrirane = svePoruke.filter(p =>
          (p.ulogovani === user.korisnickoIme && p.korIme === kontakt) ||
          (p.ulogovani === kontakt && p.korIme === user.korisnickoIme)
        );
        console.log(user);
        console.log(kontakt);

        for (const poruka of filtrirane) {
        const jePrimljenaOdKontakta =
          poruka.ulogovani === kontakt && poruka.korIme === user.korisnickoIme && poruka.stanje !== PorukaEnum.Procitano;

        const jePoslataOdUlogovanog =
          poruka.ulogovani === user.korisnickoIme && poruka.korIme === kontakt && poruka.stanje !== PorukaEnum.Procitano;

        if (jePrimljenaOdKontakta) {
          try {
            const podaci1 = {
              korIme: poruka.korIme,
              ulogovani: poruka.ulogovani,
              poslataPoruka: poruka.poslataPoruka,
              primljenaPoruka: poruka.primljenaPoruka,
              stanje: PorukaEnum.Procitano
            };

            const uspesno1 = await MessagesApi.updatePoruke(token, podaci1);

            if (uspesno1) {
              poruka.stanje = PorukaEnum.Procitano;
            }
          } catch (err) {
            console.error(`Greška pri označavanju poruke kao pročitane`, err);
          }
        }

        if (jePoslataOdUlogovanog) {
          try {
            const podaci2 = {
              korIme: poruka.korIme,
              ulogovani: poruka.ulogovani,
              poslataPoruka: poruka.poslataPoruka,
              primljenaPoruka: poruka.primljenaPoruka,
              stanje: PorukaEnum.Procitano
            };

            const uspesno2 = await MessagesApi.updatePoruke(token, podaci2);

            if (uspesno2) {
              poruka.stanje = PorukaEnum.Procitano;
            }
          } catch (err) {
            console.error(`Greška pri označavanju poruke kao pročitane`, err);
          }
        }
      }

        setPoruke(filtrirane);
        console.log(filtrirane);
        
      } catch (err) {
        console.error("Greška pri učitavanju poruka:", err);
      }
    };
    fetchPoruke();
  }, [token, user, kontakt]);

  const posaljiOvuPoruku = async () => {
    if (novaPoruka.trim() === '') return;

    if (!user) {
      console.error('Nije ulogovan korisnik.');
      return;
    }

    const nova = new Poruka(
      kontakt,                   
      user.korisnickoIme,        
      '',                        
      novaPoruka,                
      PorukaEnum.Poslato         
    );

    console.log(nova);
    try {
      const novaSaServera = await MessagesApi.posaljiPoruku(nova, token ?? "");

      console.log("Nova poruka sa servera:", novaSaServera);

      setPoruke(prev => [...prev, novaSaServera]);
      setNovaPoruka('');
    } catch (error) {
      console.error('Greška pri slanju poruke:', error);
    }
  };

  return (
    <div className="messenger-container">
      <h2>Поруке са корисником {kontakt}</h2>
      <div className="poruke-box">
        {poruke.map((poruka, index) => {
          const jeMoja = poruka.ulogovani === user?.korisnickoIme;
          const tekst = poruka.ulogovani === user?.korisnickoIme ? poruka.poslataPoruka : poruka.primljenaPoruka || poruka.poslataPoruka;

          return (
            <div
              key={index}
              className={`poruka ${jeMoja ? 'moja' : 'njihova'}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{tekst}</span>
                <span style={{ fontSize: "0.9em", color: poruka.stanje === PorukaEnum.Procitano ? 'rgba(69, 105, 213, 1)' : 'gray' }}>
                  {poruka.stanje === PorukaEnum.Procitano ? '✔✔' : '✔'}
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
