import { useId } from 'react';
import type { IconBaseProps } from './icon.types';
import { iconVariants } from './icon.variants';

export function Icon(props: IconBaseProps) {
  const { className, variant = 'default', size = 'md', color = 'default', children, id, ref, ...rest } = props;

  const generatedId = useId();
  const iconId = id || generatedId;
  const hasWrapper = variant !== 'default';

  const svgStyles = iconVariants({ size, color });
  const wrapperStyles = iconVariants({ variant, size: 'none', color });

  const svgElement = (
    <svg
      ref={ref}
      id={iconId}
      data-slot='icon'
      className={hasWrapper ? svgStyles.root() : svgStyles.root({ className })}
      viewBox='0 0 24 24'
      aria-hidden={!rest['aria-label']}
      role={rest['aria-label'] ? 'img' : undefined}
      {...rest}
    >
      {children}
    </svg>
  );

  if (!hasWrapper) {
    return svgElement;
  }

  return (
    <span data-slot='icon-wrapper' className={wrapperStyles.root({ className })}>
      {svgElement}
    </span>
  );
}
