import { booleanSort, dateSort, numericSort, stringSort } from '../../../lib/sort';
import { inputDocsUtils } from '../../input/_presets/docs/input-docs.utils';
import { inputFloatUtils } from '../../input/_presets/float/input-float.utils';
import { inputIntUtils } from '../../input/_presets/int/input-int.utils';
import { inputMoneyUtils } from '../../input/_presets/money/input-money.utils';
import { inputPercentUtils } from '../../input/_presets/percent/input-percent.utils';
import { inputTelUtils } from '../../input/_presets/tel/input-tel.utils';
import type { DataTableColumnType, DataTableColumnTypeConfig } from './data-table.types';

const columnTypeRegistry: Record<DataTableColumnType, DataTableColumnTypeConfig> = {
  text: {
    format: (v) => String(v ?? ''),
    align: 'left',
    sort: stringSort,
  },

  int: {
    format: (v, opts) =>
      inputIntUtils.format(Number(v) || 0, {
        locale: opts?.locale ?? 'pt-BR',
        thousandSeparator: opts?.thousandSeparator ?? true,
        unit: opts?.unit,
      }),
    align: 'right',
    sort: numericSort,
  },

  float: {
    format: (v, opts) =>
      inputFloatUtils.format(Number(v) || 0, {
        locale: opts?.locale ?? 'pt-BR',
        decimalPlaces: opts?.decimalPlaces ?? 2,
        thousandSeparator: opts?.thousandSeparator ?? true,
        unit: opts?.unit,
      }),
    align: 'right',
    sort: numericSort,
  },

  money: {
    format: (v, opts) =>
      inputMoneyUtils.format(Number(v) || 0, {
        locale: opts?.locale ?? 'pt-BR',
        currency: opts?.currency ?? 'BRL',
        decimalPlaces: opts?.decimalPlaces ?? 2,
      }),
    align: 'right',
    sort: numericSort,
  },

  percent: {
    format: (v, opts) =>
      inputPercentUtils.format(Number(v) || 0, {
        locale: opts?.locale ?? 'pt-BR',
        decimalPlaces: opts?.decimalPlaces ?? 2,
      }),
    align: 'right',
    sort: numericSort,
  },

  date: {
    format: (v, opts) => {
      if (!v) return '';
      const date = v instanceof Date ? v : new Date(String(v));
      if (isNaN(date.getTime())) return String(v);
      return new Intl.DateTimeFormat(opts?.dateLocale ?? opts?.locale ?? 'pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
    },
    align: 'right',
    sort: dateSort,
  },

  datetime: {
    format: (v, opts) => {
      if (!v) return '';
      const date = v instanceof Date ? v : new Date(String(v));
      if (isNaN(date.getTime())) return String(v);
      return new Intl.DateTimeFormat(opts?.dateLocale ?? opts?.locale ?? 'pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    },
    align: 'right',
    sort: dateSort,
  },

  time: {
    format: (v) => String(v ?? ''),
    align: 'right',
    sort: stringSort,
  },

  tel: {
    format: (v, opts) => {
      const digits = String(v ?? '').replace(/\D/g, '');
      if (!digits) return '';
      return inputTelUtils.format(digits, opts?.telLocale ?? 'pt-BR');
    },
    align: 'left',
    sort: stringSort,
  },

  docs: {
    format: (v, opts) => {
      const raw = inputDocsUtils.extractRaw(String(v ?? ''));
      if (!raw) return '';
      const mask = opts?.mask ?? (raw.length <= 11 ? '###.###.###-##' : '##.###.###/####-##');
      return inputDocsUtils.format(raw, mask);
    },
    align: 'left',
    sort: stringSort,
  },

  boolean: {
    format: (v, opts) => (v ? (opts?.trueLabel ?? 'Sim') : (opts?.falseLabel ?? 'Não')),
    align: 'center',
    sort: booleanSort,
  },

  status: {
    format: (v, opts) => (v ? (opts?.trueLabel ?? 'Ativo') : (opts?.falseLabel ?? 'Inativo')),
    align: 'center',
    sort: booleanSort,
  },
};

export function resolveColumnType(type: DataTableColumnType): DataTableColumnTypeConfig {
  return columnTypeRegistry[type] ?? columnTypeRegistry.text;
}
