import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Poruka } from '../../../../server/src/Domain/models/Poruka';
import { PorukaEnum } from '../../../../server/src/Domain/enums/PorukaEnum';
import { MessagesApi } from '../../api_services/messages/MessageApiService';
import { useAuth } from '../../hooks/auth/UseAuthHook';

function PorukeKorisnika() {
  const { korIme } = useParams<{ korIme: string }>();
  const navigate = useNavigate();

  const [poruke, setPoruke] = useState<Poruka[]>([]);
  const [novaPoruka, setNovaPoruka] = useState('');
  const { token, logout } = useAuth();

  useEffect(() => {
    (async () => {
      const data = await MessagesApi.getSvePoruke(token ?? "");
      const korisnici = data.filter(korisnik => korisnik.uloga === "user");
      setKorisnici(korisnici);
    })();
  }, [token, usersApi]);

  const posaljiPoruku = async () => {
    if (novaPoruka.trim() === '') return;

    const nova = new Poruka(
      `korisnik${korIme}`,
      '',
      novaPoruka,
      PorukaEnum.Poslato
    );

    try {
      const res = await axios.post('http://localhost:4000/api/messages', nova);
      setPoruke([...poruke, nova]);
      setNovaPoruka('');
    } catch (error) {
      console.error('Greška pri slanju poruke:', error);
    }
  };

  return (
    <div className="messenger-container">
      <h2>Поруке са корисником {korIme}</h2>

      <button className="back-button" onClick={() => navigate('/kontakti')}>
        ← Nazad na kontakte
      </button>

      <div className="poruke-box">
        {poruke.map((poruka, index) => {
          const jeMoja = poruka.stanje === PorukaEnum.Poslato;
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
        <button onClick={posaljiPoruku}>Pošalji</button>
      </div>
    </div>
  );
}

export default PorukeKorisnika;
