import { Children, useId } from 'react';
import { IconChevronRight } from '../../icon';
import type { BreadcrumbBaseProps } from './breadcrumb.types';
import { breadcrumbVariants } from './breadcrumb.variants';

export function Breadcrumb(props: BreadcrumbBaseProps) {
  const { className, separator, children, id, ref, ...rest } = props;

  const generatedId = useId();
  const navId = id || generatedId;
  const styles = breadcrumbVariants();

  const items = Children.toArray(children);
  const separatorElement = separator ?? <IconChevronRight size='sm' color='muted' />;

  return (
    <nav
      ref={ref}
      id={navId}
      data-slot='breadcrumb'
      aria-label='Breadcrumb'
      className={styles.root({ className })}
      {...rest}
    >
      <ol className={styles.list()}>
        {items.map((child, index) => (
          <li key={index} className='flex items-center gap-2'>
            {child}
            {index < items.length - 1 && (
              <span className={styles.separator()} aria-hidden='true'>
                {separatorElement}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
