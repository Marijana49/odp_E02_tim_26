import { useParams } from 'react-router-dom';
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
          const tekst = poruka.poslataPoruka || poruka.primljenaPoruka || '';

          return (
            <div
              key={index}
              className={`poruka ${jeMoja ? 'moja' : 'njihova'}`}
            >
              {tekst}
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
      </div>
    </div>
  );
}

export default PorukeKorisnika;
