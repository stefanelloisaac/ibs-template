export const inputMonthUtils = {
  MIN_YEAR: 1970,
  MAX_YEAR: 2100,

  hasValidYearLength: (value: string): boolean => {
    if (!value) return true;
    const year = value.split('-')[0];
    return year.length <= 4;
  },

  getMinMonth: (): string => `${inputMonthUtils.MIN_YEAR}-01`,
  getMaxMonth: (): string => `${inputMonthUtils.MAX_YEAR}-12`,
};
