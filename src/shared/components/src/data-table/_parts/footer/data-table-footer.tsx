import {
  useDataTableColumns,
  useDataTableExpansion,
  useDataTablePinning,
  useDataTableSelection,
} from '../../../../store/data-table/use-data-table';
import { getPinClassName, getUtilityPinClassName } from '../../_features/data-table-pinning';
import { dataTableFooterVariants } from './data-table-footer.variants';

export function DataTableFooter() {
  const columns = useDataTableColumns();
  const selection = useDataTableSelection();
  const expansion = useDataTableExpansion();
  const pinning = useDataTablePinning();

  const styles = dataTableFooterVariants();
  const utilityPinClass = getUtilityPinClassName(pinning.utility, 1);

  return (
    <tfoot data-slot='data-table-footer' className={styles.root()}>
      <tr>
        {!!selection.enabled && (
          <td
            className={`${styles.cell()} ${utilityPinClass}`}
            style={pinning.utility?.checkbox != null ? { left: pinning.utility.checkbox } : undefined}
          />
        )}
        {expansion.hasExpandable && (
          <td
            className={`${styles.cell()} ${utilityPinClass}`}
            style={pinning.utility?.expand != null ? { left: pinning.utility.expand } : undefined}
          />
        )}
        {columns.visible.map((col) => {
          const pin = pinning.offsets[col.id];
          const pinClass = getPinClassName(pin, 1);

          return (
            <td
              key={col.id}
              className={`${styles.cell()} ${pinClass}`}
              style={pin ? { [pin.side]: pin.offset } : undefined}
            >
              {typeof col.footer === 'function' ? (col.footer as () => React.ReactNode)() : col.footer}
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
}
