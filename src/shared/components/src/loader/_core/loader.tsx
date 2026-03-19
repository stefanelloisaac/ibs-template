import { useId } from 'react';
import type { LoaderBaseProps } from './loader.types';
import { loaderVariants } from './loader.variants';

export function Loader(props: LoaderBaseProps) {
  const { className, size = 'md', overlay = false, fullScreen = false, message, id, ref, ...rest } = props;

  const generatedId = useId();
  const loaderId = id || generatedId;
  const styles = loaderVariants({ size, overlay, fullScreen });

  return (
    <div
      ref={ref}
      id={loaderId}
      data-slot='loader'
      role='status'
      aria-label={message ?? 'Carregando...'}
      className={styles.root({ className })}
      {...rest}
    >
      <svg data-slot='loader-spinner' className={styles.spinner()} viewBox='0 0 24 24' fill='none'>
        <circle cx='12' cy='12' r='9.5' stroke='currentColor' strokeWidth='3' className='text-border opacity-30' />
        <g>
          <circle
            cx='12'
            cy='12'
            r='9.5'
            stroke='currentColor'
            strokeWidth='3'
            strokeLinecap='round'
            className='text-primary'
          >
            <animate
              attributeName='stroke-dasharray'
              dur='1.5s'
              calcMode='spline'
              values='0 150;42 150;42 150;42 150'
              keyTimes='0;0.475;0.95;1'
              keySplines='0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1'
              repeatCount='indefinite'
            />
            <animate
              attributeName='stroke-dashoffset'
              dur='1.5s'
              calcMode='spline'
              values='0;-16;-59;-59'
              keyTimes='0;0.475;0.95;1'
              keySplines='0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1'
              repeatCount='indefinite'
            />
          </circle>
          <animateTransform
            attributeName='transform'
            type='rotate'
            dur='2s'
            values='0 12 12;360 12 12'
            repeatCount='indefinite'
          />
        </g>
      </svg>
      {message && (
        <span data-slot='loader-message' className={styles.message()}>
          {message}
        </span>
      )}
    </div>
  );
}
