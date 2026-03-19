export const inputDateUtils = {
  MIN_YEAR: 1970,
  MAX_YEAR: 2100,

  hasValidYearLength: (value: string): boolean => {
    if (!value) return true;
    const year = value.split('-')[0];
    return year.length <= 4;
  },

  getMinDate: (): string => `${inputDateUtils.MIN_YEAR}-01-01`,
  getMaxDate: (): string => `${inputDateUtils.MAX_YEAR}-12-31`,
};
