import type { TelLocale, TelMaskConfig } from './input-tel.types';

const masks: Record<TelLocale, TelMaskConfig> = {
  'pt-BR': {
    mobile: '(##) #####-####',
    landline: '(##) ####-####',
    maxDigits: 11,
    isMobile: (digits) => digits.length >= 3 && digits[2] === '9',
  },
  'en-US': {
    mobile: '(###) ###-####',
    landline: '(###) ###-####',
    maxDigits: 10,
    isMobile: () => true,
  },
};

export const inputTelUtils = {
  masks,

  getMaskConfig: (locale: TelLocale): TelMaskConfig => {
    return masks[locale] || masks['pt-BR'];
  },

  format: (digits: string, locale: TelLocale): string => {
    const config = inputTelUtils.getMaskConfig(locale);
    const limitedDigits = digits.slice(0, config.maxDigits);

    if (!limitedDigits) return '';

    const mask = config.isMobile(limitedDigits) ? config.mobile : config.landline;

    let result = '';
    let digitIndex = 0;

    for (let i = 0; i < mask.length && digitIndex < limitedDigits.length; i++) {
      if (mask[i] === '#') {
        result += limitedDigits[digitIndex];
        digitIndex++;
      } else {
        result += mask[i];
      }
    }

    return result;
  },

  getMaxLength: (locale: TelLocale): number => {
    const config = inputTelUtils.getMaskConfig(locale);
    return config.mobile.length;
  },
};
