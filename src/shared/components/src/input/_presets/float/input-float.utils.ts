import type { InputFloatFormatOptions } from './input-float.types';

export const inputFloatUtils = {
  MAX_VALUE: 1_000_000_000_000,
  MAX_VALUE_DIGITS: 13,

  getMaxSmallestUnit: (decimalPlaces: number): number => {
    return inputFloatUtils.MAX_VALUE * Math.pow(10, decimalPlaces);
  },

  getMaxDigits: (decimalPlaces: number): number => {
    return inputFloatUtils.MAX_VALUE_DIGITS + decimalPlaces;
  },

  format: (valueInSmallestUnit: number, options: InputFloatFormatOptions): string => {
    const { locale = 'pt-BR', decimalPlaces = 2, thousandSeparator = true, unit } = options;
    const divisor = Math.pow(10, decimalPlaces);
    const value = valueInSmallestUnit / divisor;

    const formatted = new Intl.NumberFormat(locale, {
      useGrouping: thousandSeparator,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    })
      .format(value)
      .replace(/\u00A0/g, ' ');

    return unit ? `${formatted} ${unit}` : formatted;
  },

  getMaxLength: (options: InputFloatFormatOptions): number => {
    const maxSmallestUnit = inputFloatUtils.getMaxSmallestUnit(options.decimalPlaces ?? 2);
    return inputFloatUtils.format(maxSmallestUnit, options).length;
  },
};
