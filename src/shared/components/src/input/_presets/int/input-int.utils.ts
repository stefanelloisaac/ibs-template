import type { InputIntFormatOptions } from './input-int.types';

export const inputIntUtils = {
  MAX_VALUE: 1_000_000_000_000,
  MAX_DIGITS: 13,

  format: (value: number, options: InputIntFormatOptions): string => {
    const { locale = 'pt-BR', thousandSeparator = true, unit } = options;

    const formatted = new Intl.NumberFormat(locale, {
      useGrouping: thousandSeparator,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace(/\u00A0/g, ' ');

    return unit ? `${formatted} ${unit}` : formatted;
  },

  getMaxLength: (options: InputIntFormatOptions): number => {
    return inputIntUtils.format(inputIntUtils.MAX_VALUE, options).length;
  },
};
