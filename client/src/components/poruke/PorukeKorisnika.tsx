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
  const [kontakt, setKontakt] = useState(''); //kontakt koji komunicira sa userom
  const { user, token } = useAuth(); //moj ulogovani user

  useEffect(() => {
    if (id && token) {
      const fetchContact = async () => {
        try {
          const data = await usersApi.getKorisnikById(token, parseInt(id));
          console.log(data)
          if (data) {
            setKontakt(data.korisnickoIme);
          }
        } catch (error) {
          console.error("Greska pri dobavljanju korisnika iz kontakta:", error);
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

        const filtrirane = svePoruke.filter(p =>
          (p.ulogovani === user.korisnickoIme && p.korIme === kontakt) ||
          (p.ulogovani === kontakt && p.korIme === user.korisnickoIme)
        );

        setPoruke(filtrirane);
      } catch (err) {
        console.error("Greška pri učitavanju poruka:", err);
      }
    };
    fetchPoruke();
  }, [token, user, kontakt]);

  const posaljiOvuPoruku = async () => {
    if (novaPoruka.trim() === '') return;

    const nova = new Poruka(
      kontakt,
      user?.korisnickoIme,
      '',
      novaPoruka,
      PorukaEnum.Poslato
    );

    try {
      const novaSaServera = await MessagesApi.posaljiPoruku(nova, token ?? "");

      setPoruke(prev => [...prev, novaSaServera]);
      setNovaPoruka('');
    } catch (error) {
      console.error('Greška pri slanju poruke:', error);
    }
    console.log(poruke, novaPoruka);

  };

  return (
    <div className="messenger-container">
      <h2>Поруке са корисником {kontakt}</h2>
      <div className="poruke-box">
        {poruke.map((poruka, index) => {
          const jeMoja = poruka.ulogovani === user?.korisnickoIme;
          const tekst = jeMoja ? poruka.poslataPoruka : poruka.primljenaPoruka;

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
          placeholder="Upiši poruku..."
        />
        <button onClick={posaljiOvuPoruku}>Pošalji</button>
      </div>
    </div>
  );
}

export default PorukeKorisnika;
