type LayoutFooterProps = {
  footerText: string;
};

export function LayoutFooter({ footerText }: LayoutFooterProps) {
  return <footer className='border-t px-4 py-2 text-center text-xs text-muted-foreground'>{footerText}</footer>;
}
