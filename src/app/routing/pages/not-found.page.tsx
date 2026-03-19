import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>
      <p>Pagina nao encontrada.</p>
      <Link to='/'>Voltar para o inicio</Link>
    </div>
  );
}
