import { useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import type { AuthLoginFormValues } from '../types/auth-form.types';
import { authGetErrorMessage } from '../utils/auth-error.utils';
import { useSession } from '@/core/session';
import { useTenant } from '@/core/tenant';
import { useAuthLogin } from '@/generated/auth';
import { ButtonPrimary } from '@/shared/components/src/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/src/card';
import { InputEmail, InputPassword } from '@/shared/components/src/input';

const loginHighlights = [
  {
    eyebrow: 'UX focada',
    title: 'Acesso rapido',
    description: 'Fluxo direto, leitura clara e foco imediato na acao principal.',
  },
  {
    eyebrow: 'Seguranca visual',
    title: 'Sinais de confianca',
    description: 'Estados bem definidos para reduzir duvida durante autenticacao.',
  },
  {
    eyebrow: 'Responsivo',
    title: 'Funciona em qualquer tela',
    description: 'Layout adaptado para mobile, tablet e desktop sem perder hierarquia.',
  },
];

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { config } = useTenant();
  const { status, isAuthenticated, refreshSession } = useSession();
  const [formValues, setFormValues] = useState<AuthLoginFormValues>({
    email: '',
    password: '',
  });
  const { email, password } = formValues;

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('returnTo') || '/';
  }, [location.search]);

  const loginMutation = useAuthLogin({
    meta: { skipGlobalError: true },
  });

  const errorMessage = authGetErrorMessage(loginMutation.error);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await loginMutation.mutateAsync({
        body: { email, password },
      });
      await refreshSession();
      navigate(redirectTo, { replace: true });
    } catch {
      // The mutation state already exposes the API error for the UI.
    }
  }

  return (
    <div className='relative isolate min-h-[clamp(36rem,calc(100svh-8rem),52rem)] overflow-hidden rounded-[2rem] border border-border/60 bg-background px-4 py-6 shadow-[0_32px_120px_-64px_rgba(0,0,0,0.45)] sm:px-6 sm:py-8 lg:px-8'>
      <div aria-hidden className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/12 via-background to-background dark:from-primary/18 dark:via-background dark:to-background' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--color-border)_60%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--color-border)_60%,transparent)_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-30' />
        <div className='absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/18 blur-3xl dark:bg-primary/25' />
        <div className='absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/12 blur-3xl dark:bg-primary/20' />
        <div className='absolute left-[12%] top-24 h-28 w-28 rounded-[2rem] border border-border/60 bg-background/45 shadow-2xl backdrop-blur-xl [transform:rotateX(62deg)_rotateY(-24deg)_rotateZ(18deg)]' />
        <div className='absolute right-[18%] top-16 h-20 w-20 rounded-[1.75rem] border border-primary/25 bg-primary/12 shadow-xl backdrop-blur-xl [transform:rotateX(58deg)_rotateY(22deg)_rotateZ(-18deg)]' />
        <div className='absolute bottom-16 right-[12%] h-32 w-32 rounded-[2.25rem] border border-border/60 bg-background/50 shadow-2xl backdrop-blur-xl [transform:rotateX(65deg)_rotateY(24deg)_rotateZ(-20deg)]' />
      </div>

      <div className='relative z-10 grid min-h-full items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,30rem)] lg:gap-12'>
        <section className='flex flex-col justify-center gap-6'>
          <div className='inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase shadow-sm backdrop-blur-xl'>
            Experiencia de autenticacao redesenhada
          </div>

          <div className='space-y-4'>
            {config.branding.logoUrl && (
              <img src={config.branding.logoUrl} alt={config.appName} className='h-11 w-auto object-contain sm:h-12' />
            )}

            <div className='space-y-3'>
              <p className='text-sm font-medium tracking-[0.22em] text-primary uppercase'>Acesso moderno para o seu tenant</p>
              <h1 className='max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl'>
                Entre no {config.appName} com uma interface mais clara, elegante e focada.
              </h1>
              <p className='max-w-xl text-base leading-7 text-muted-foreground sm:text-lg'>
                O novo layout combina profundidade visual, leitura confortavel e uma jornada direta para deixar o login
                mais intuitivo em qualquer dispositivo.
              </p>
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
            {loginHighlights.map((highlight) => (
              <div
                key={highlight.title}
                className='rounded-[1.5rem] border border-border/70 bg-background/65 p-4 shadow-lg backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1'
              >
                <p className='text-[0.7rem] font-semibold tracking-[0.18em] text-primary uppercase'>{highlight.eyebrow}</p>
                <p className='mt-3 text-base font-semibold text-foreground'>{highlight.title}</p>
                <p className='mt-2 text-sm leading-6 text-muted-foreground'>{highlight.description}</p>
              </div>
            ))}
          </div>

          <div className='hidden max-w-xl rounded-[1.75rem] border border-border/70 bg-background/60 p-5 shadow-lg backdrop-blur-xl lg:block'>
            <p className='text-sm font-medium text-foreground'>Fluxo otimizado para produtividade</p>
            <p className='mt-2 text-sm leading-6 text-muted-foreground'>
              Hierarquia visual forte, profundidade sutil e estados claros ajudam a reduzir friccao sem alterar a logica
              atual da autenticacao.
            </p>
          </div>
        </section>

        <section className='relative flex items-center justify-center lg:justify-end'>
          <div className='absolute inset-x-6 bottom-0 top-8 rounded-[2rem] bg-primary/8 blur-3xl dark:bg-primary/12' aria-hidden />

          <Card
            padding='none'
            className='relative w-full max-w-xl overflow-hidden rounded-[2rem] border-border/70 bg-background/72 shadow-2xl shadow-primary/10 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/65'
          >
            <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent' aria-hidden />

            <CardHeader className='gap-3 px-6 pt-6 pb-4 sm:px-8 sm:pt-8'>
              <div className='flex flex-wrap items-start justify-between gap-3'>
                <div className='space-y-2'>
                  <p className='text-xs font-semibold tracking-[0.2em] text-primary uppercase'>Login</p>
                  <CardTitle size='lg' className='text-2xl leading-tight sm:text-[2rem]'>
                    Entre para continuar
                  </CardTitle>
                </div>

                <div className='rounded-full border border-border/70 bg-background/75 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-xl'>
                  Sessao: <span className='text-foreground'>{status}</span>
                </div>
              </div>

              <CardDescription className='max-w-md text-sm leading-6 text-muted-foreground'>
                Use suas credenciais para acessar o ambiente com a mesma logica atual de autenticacao, agora em uma
                experiencia visual mais refinada.
              </CardDescription>

              {redirectTo !== '/' && (
                <div className='rounded-2xl border border-primary/15 bg-primary/8 px-4 py-3 text-sm leading-6 text-muted-foreground'>
                  Apos entrar, voce sera levado de volta ao fluxo que iniciou antes do login.
                </div>
              )}

              {isAuthenticated && (
                <div className='rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm leading-6 text-muted-foreground'>
                  A sessao ja foi identificada neste navegador.{' '}
                  <Link to='/auth/debug' className='font-medium text-primary transition-colors hover:text-primary/80'>
                    Ir para auth debug
                  </Link>
                </div>
              )}
            </CardHeader>

            <CardContent className='border-border/60 px-6 py-6 sm:px-8'>
              <form className='space-y-5' onSubmit={handleSubmit}>
                <InputEmail
                  label='Email'
                  placeholder='seu@email.com'
                  value={email}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, email: event.target.value }))}
                  intent={errorMessage ? 'error' : 'default'}
                  className='h-11 rounded-xl border-border/70 bg-background/70 px-4 shadow-sm backdrop-blur-sm'
                />

                <InputPassword
                  label='Senha'
                  placeholder='********'
                  value={password}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, password: event.target.value }))}
                  intent={errorMessage ? 'error' : 'default'}
                  className='h-11 rounded-xl border-border/70 bg-background/70 px-4 shadow-sm backdrop-blur-sm'
                />

                {errorMessage && (
                  <div
                    role='alert'
                    className='rounded-2xl border border-error/25 bg-error/10 px-4 py-3 text-sm leading-6 text-red-700 shadow-sm dark:text-red-300'
                  >
                    {errorMessage}
                  </div>
                )}

                <ButtonPrimary
                  type='submit'
                  fullWidth
                  size='lg'
                  loading={loginMutation.isPending}
                  disabled={!email || !password}
                  className='mt-2 h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary/90'
                >
                  {loginMutation.isPending ? 'Entrando...' : 'Entrar na plataforma'}
                </ButtonPrimary>
              </form>
            </CardContent>

            <CardFooter className='flex-col items-start gap-4 px-6 pt-5 pb-6 sm:px-8 sm:pb-8' justify='between'>
              <p className='text-sm leading-6 text-muted-foreground'>
                Nao tem conta ainda?{' '}
                <Link to='/register' className='font-medium text-primary transition-colors hover:text-primary/80'>
                  Cadastre-se
                </Link>
              </p>

              <p className='text-xs leading-5 text-muted-foreground'>
                Seu acesso continua usando a mesma API e a mesma sessao do fluxo atual.
              </p>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
}
