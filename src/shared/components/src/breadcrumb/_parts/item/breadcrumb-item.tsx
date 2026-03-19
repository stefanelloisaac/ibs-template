import type { BreadcrumbItemProps } from './breadcrumb-item.types';
import { breadcrumbItemVariants } from './breadcrumb-item.variants';

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const styles = breadcrumbItemVariants({ current: props.current });

  if (props.current) {
    const { current: _current, className, children, ref, ...rest } = props;
    return (
      <span ref={ref} data-slot='breadcrumb-item' aria-current='page' className={styles.root({ className })} {...rest}>
        {children}
      </span>
    );
  }

  const { current: _current, className, children, href, ref, ...rest } = props;
  return (
    <a ref={ref} data-slot='breadcrumb-item' href={href} className={styles.root({ className })} {...rest}>
      {children}
    </a>
  );
}
