import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Poruka } from '../../../../server/src/Domain/models/Poruka';
import { PorukaEnum } from '../../../../server/src/Domain/enums/PorukaEnum';
import { MessagesApi } from '../../api_services/messages/MessageApiService';
import { useMessAuth } from '../../hooks/auth/UseMessAuthHooks';
import { useAuth } from '../../hooks/auth/UseAuthHook';

function PorukeKorisnika() {
  const { korIme } = useParams<{ korIme: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // trenutni ulogovani korisnik
  const { token } = useMessAuth();

  const [poruke, setPoruke] = useState<Poruka[]>([]);
  const [novaPoruka, setNovaPoruka] = useState('');

  // Učitaj sve poruke
  useEffect(() => {
    if (!token || !user || !korIme) return;

    const fetchPoruke = async () => {
      try {
        const svePoruke = await MessagesApi.getSvePoruke(token);

        // Filtriraj samo poruke između ulogovanog korisnika i korisnika iz URL-a
        const filtrirane = svePoruke.filter(p =>
          (p.ulogovani === user.korisnickoIme && p.korIme === korIme) ||
          (p.ulogovani === korIme && p.korIme === user.korisnickoIme)
        );

        setPoruke(filtrirane);
      } catch (err) {
        console.error("Greška pri učitavanju poruka:", err);
      }
    };

    fetchPoruke();
  }, [token, user, korIme]);

  // Slanje nove poruke
  const posaljiPoruku = async () => {
    if (!novaPoruka.trim() || !user) return; // || !korIme

    const nova = {
      korIme: korIme,
      ulogovani: user.korisnickoIme,
      poslataPoruka: novaPoruka,
      primljenaPoruka: "",
      stanje: PorukaEnum.Poslato
    } as Poruka;

    try {
      const novaSaServera = await MessagesApi.posaljiPoruku(nova, token ?? "");

      // Ažuriraj listu poruka
      setPoruke(prev => [...prev, novaSaServera]);
      setNovaPoruka('');
    } catch (error) {
      console.error('Greška pri slanju poruke:', error);
    }
  };

  const handleNazad = () => {
    if (!user) return;

    if (user.uloga === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/user-dashboard');
    }
  };

  return (
    <div className="messenger-container">
      <h2>Поруке са корисником {korIme}</h2>

      <button className="back-button" onClick={handleNazad}>
        ← Nazad na kontakte
      </button>

      <div className="poruke-box">
        {poruke.map((poruka, index) => {
          const jeMoja = poruka.ulogovani === user?.korisnickoIme;
          const tekst = jeMoja ? poruka.poslataPoruka : poruka.primljenaPoruka;

          return (
            <div key={index} className={`poruka ${jeMoja ? 'moja' : 'njihova'}`}>
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
