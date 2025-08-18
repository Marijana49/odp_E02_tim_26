import { Link } from "react-router-dom";

export default function NotFoundStranica() {
  return (
    <main>
      <div>
        <h1>404</h1>
        <h2>Страница није пронађена</h2>
        <p>
          Страница коју тражите не постоји или је премештена.
        </p>
        <Link
          to="/"
        >
          Назад на почетну
        </Link>
      </div>
    </main>
  );
}
