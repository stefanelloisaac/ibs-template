import { Link } from 'react-router';

export default function ForbiddenPage() {
  return (
    <div>
      <h1>403</h1>
      <p>Voce nao tem permissao para acessar esta pagina.</p>
      <Link to='/'>Voltar para o inicio</Link>
    </div>
  );
}
