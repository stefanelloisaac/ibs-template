import type { InputPercentFormatOptions } from './input-percent.types';

export const inputPercentUtils = {
  MAX_VALUE: 1_000_000_000_000,
  MAX_VALUE_DIGITS: 13,

  getMaxCents: (decimalPlaces: number): number => {
    return inputPercentUtils.MAX_VALUE * Math.pow(10, decimalPlaces);
  },

  getMaxDigits: (decimalPlaces: number): number => {
    return inputPercentUtils.MAX_VALUE_DIGITS + decimalPlaces;
  },

  format: (valueInCents: number, options: InputPercentFormatOptions): string => {
    const { locale = 'pt-BR', decimalPlaces = 2 } = options;
    const divisor = Math.pow(10, decimalPlaces);
    const value = valueInCents / divisor;
    const decimalValue = value / 100;
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    })
      .format(decimalValue)
      .replace(/\u00A0/g, ' ');
  },

  getMaxLength: (options: InputPercentFormatOptions): number => {
    const maxCents = inputPercentUtils.getMaxCents(options.decimalPlaces ?? 2);
    return inputPercentUtils.format(maxCents, options).length;
  },
};
