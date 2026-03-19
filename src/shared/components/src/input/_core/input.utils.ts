export const inputUtils = {
  countDigits: (str: string, end: number): number => {
    return str.slice(0, end).replace(/\D/g, '').length;
  },

  findCursorPosition: (formatted: string, digitPos: number): number => {
    let digits = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        digits++;
        if (digits === digitPos) return i + 1;
      }
    }
    return formatted.length;
  },

  extractDigits: (str: string): string => {
    return str.replace(/\D/g, '');
  },
};
