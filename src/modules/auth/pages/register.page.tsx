import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import type { AuthRegisterFormValues } from '../types/auth-form.types';
import { authGetErrorMessage } from '../utils/auth-error.utils';
import { useTenant } from '@/core/tenant';
import { useAuthRegister } from '@/generated/auth';

export default function RegisterPage() {
  const { config } = useTenant();
  const [formValues, setFormValues] = useState<AuthRegisterFormValues>({
    name: '',
    email: '',
    password: '',
  });
  const [registeredUserJson, setRegisteredUserJson] = useState<string | null>(null);
  const { name, email, password } = formValues;

  const registerMutation = useAuthRegister({
    meta: { skipGlobalError: true },
  });

  const errorMessage = authGetErrorMessage(registerMutation.error);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const user = await registerMutation.mutateAsync({
        body: { name, email, password },
      });
      setRegisteredUserJson(JSON.stringify(user, null, 2));
    } catch {
      setRegisteredUserJson(null);
    }
  }

  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='w-full max-w-sm space-y-6 rounded-lg border bg-primary/5 p-6 shadow-sm'>
        <div className='space-y-1 text-center'>
          {config.branding.logoUrl && (
            <img src={config.branding.logoUrl} alt={config.appName} className='mx-auto h-10' />
          )}
          <h1 className='text-xl font-semibold'>{config.appName}</h1>
          <p className='text-sm text-muted-foreground'>Crie uma conta para testar a mutation de cadastro</p>
        </div>

        <form className='space-y-4' onSubmit={handleSubmit}>
          <div className='space-y-1'>
            <label htmlFor='name' className='text-sm font-medium'>
              Nome
            </label>
            <input
              id='name'
              type='text'
              value={name}
              onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
              placeholder='Seu nome'
              className='w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary'
            />
          </div>

          <div className='space-y-1'>
            <label htmlFor='email' className='text-sm font-medium'>
              Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(event) => setFormValues((prev) => ({ ...prev, email: event.target.value }))}
              placeholder='seu@email.com'
              className='w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary'
            />
          </div>

          <div className='space-y-1'>
            <label htmlFor='password' className='text-sm font-medium'>
              Senha
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(event) => setFormValues((prev) => ({ ...prev, password: event.target.value }))}
              placeholder='********'
              className='w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary'
            />
          </div>

          {errorMessage && <p className='text-sm text-red-600'>{errorMessage}</p>}

          <button
            type='submit'
            disabled={registerMutation.isPending || !name || !email || !password}
            className='w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70'
          >
            {registerMutation.isPending ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>

        {registeredUserJson && (
          <div className='space-y-3 rounded-md border bg-muted/40 p-3'>
            <p className='text-sm font-medium text-green-700'>Cadastro realizado com sucesso.</p>
            <pre className='overflow-auto rounded-md bg-muted p-3 text-xs'>{registeredUserJson}</pre>
            <Link to='/login' className='text-sm text-primary hover:underline'>
              Ir para login
            </Link>
          </div>
        )}

        <p className='text-center text-xs text-muted-foreground'>
          Ja tem conta?{' '}
          <Link to='/login' className='text-primary hover:underline'>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
