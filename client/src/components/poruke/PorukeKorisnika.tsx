import { useParams } from 'react-router-dom';

function PorukeKorisnika() {
  const { id } = useParams(); // dobija ID iz URL-a

  return (
    <div>
      <h2>Detalji korisnika</h2>
      <p>ID korisnika: {id}</p>
      {/* Ovdje možeš učitati detalje korisnika sa backenda po ID-u */}
    </div>
  );
}

export default PorukeKorisnika;
