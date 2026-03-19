import type { LayoutBrandingProps } from '../layout.types';

export function Branding({ branding, appName }: LayoutBrandingProps) {
  return (
    <>
      {branding.logoIconUrl && <img src={branding.logoIconUrl} alt={appName} className='h-6 w-6' />}
      <span className='text-sm font-semibold'>{appName}</span>
    </>
  );
}
