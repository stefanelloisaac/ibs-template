export const inputWeekUtils = {
  MIN_YEAR: 1970,
  MAX_YEAR: 2100,

  hasValidYearLength: (value: string): boolean => {
    if (!value) return true;
    const year = value.split('-')[0];
    return year.length <= 4;
  },

  getMinWeek: (): string => `${inputWeekUtils.MIN_YEAR}-W01`,
  getMaxWeek: (): string => `${inputWeekUtils.MAX_YEAR}-W52`,
};
