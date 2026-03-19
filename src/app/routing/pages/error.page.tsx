import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
        <Link to='/'>Voltar para o inicio</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Erro inesperado</h1>
      <p>{error instanceof Error ? error.message : 'Algo deu errado.'}</p>
      <Link to='/'>Voltar para o inicio</Link>
    </div>
  );
}
