import { useCallback, useRef, useState } from 'react';
import { useDataTablePagination } from '../../../../store/data-table/use-data-table';
import { IconArrowLeft } from '../../../icon/_presets/arrow-left/icon-arrow-left';
import { IconArrowRight } from '../../../icon/_presets/arrow-right/icon-arrow-right';
import { IconChevronLeft } from '../../../icon/_presets/chevron-left/icon-chevron-left';
import { IconChevronRight } from '../../../icon/_presets/chevron-right/icon-chevron-right';
import { Popover } from '../../../popover';
import { dataTablePaginationVariants } from './data-table-pagination.variants';

const THROTTLE_MS = 200;

export function DataTablePagination() {
  const pagination = useDataTablePagination();

  const [sizeOpen, setSizeOpen] = useState(false);
  const [isThrottled, setIsThrottled] = useState(false);
  const throttleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { pageIndex, pageSize } = pagination.state;
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, pagination.totalItems);
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pagination.pageCount - 1;

  const handlePageChange = useCallback(
    (index: number) => {
      if (isThrottled) return;
      pagination.setPageIndex(index);
      setIsThrottled(true);
      clearTimeout(throttleTimer.current);
      throttleTimer.current = setTimeout(() => setIsThrottled(false), THROTTLE_MS);
    },
    [isThrottled, pagination],
  );

  const handleSizeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      pagination.setPageSize(Number(e.currentTarget.dataset.size));
      setSizeOpen(false);
    },
    [pagination],
  );

  const styles = dataTablePaginationVariants();

  return (
    <div data-slot='data-table-pagination' className={styles.root()}>
      <div className={styles.info()}>
        Mostrando {start} - {end} de {pagination.totalItems}
      </div>

      <div className={styles.controls()}>
        <Popover
          open={sizeOpen}
          onOpenChange={setSizeOpen}
          placement='top-start'
          trigger={
            <button type='button' className={styles.selectButton()}>
              <span>{pageSize} por página</span>
            </button>
          }
          contentClassName='min-w-full p-1'
        >
          {pagination.sizeOptions.map((size) => (
            <div key={size} className={styles.selectItem()} data-size={size} onClick={handleSizeClick}>
              {size} por página
            </div>
          ))}
        </Popover>

        <button
          type='button'
          className={styles.button()}
          onClick={() => handlePageChange(0)}
          disabled={!canPrev || isThrottled}
          aria-label='Primeira página'
        >
          <IconChevronLeft size='sm' />
        </button>
        <button
          type='button'
          className={styles.button()}
          onClick={() => handlePageChange(pageIndex - 1)}
          disabled={!canPrev || isThrottled}
          aria-label='Página anterior'
        >
          <IconArrowLeft size='sm' />
        </button>
        <span className={styles.pageInfo()}>
          {pageIndex + 1} de {pagination.pageCount}
        </span>
        <button
          type='button'
          className={styles.button()}
          onClick={() => handlePageChange(pageIndex + 1)}
          disabled={!canNext || isThrottled}
          aria-label='Proxima página'
        >
          <IconArrowRight size='sm' />
        </button>
        <button
          type='button'
          className={styles.button()}
          onClick={() => handlePageChange(pagination.pageCount - 1)}
          disabled={!canNext || isThrottled}
          aria-label='Última página'
        >
          <IconChevronRight size='sm' />
        </button>
      </div>
    </div>
  );
}
