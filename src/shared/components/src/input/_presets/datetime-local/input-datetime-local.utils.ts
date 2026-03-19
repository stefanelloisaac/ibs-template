export const inputDatetimeLocalUtils = {
  MIN_YEAR: 1970,
  MAX_YEAR: 2100,

  hasValidYearLength: (value: string): boolean => {
    if (!value) return true;
    const year = value.split('-')[0];
    return year.length <= 4;
  },

  getMinDatetime: (): string => `${inputDatetimeLocalUtils.MIN_YEAR}-01-01T00:00`,
  getMaxDatetime: (): string => `${inputDatetimeLocalUtils.MAX_YEAR}-12-31T23:59`,
};
