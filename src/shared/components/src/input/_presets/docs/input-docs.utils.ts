export const inputDocsUtils = {
  extractRaw: (value: string): string => {
    return value.replace(/[^a-zA-Z0-9]/g, '');
  },

  countValidChars: (mask: string): number => {
    let count = 0;
    for (const char of mask) {
      if (char === '#' || char === '@') {
        count++;
      }
    }
    return count;
  },

  countCharsUpTo: (str: string, end: number): number => {
    let count = 0;
    for (let i = 0; i < end && i < str.length; i++) {
      if (/[a-zA-Z0-9]/.test(str[i])) {
        count++;
      }
    }
    return count;
  },

  findCursorPosition: (formatted: string, charPos: number): number => {
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/[a-zA-Z0-9]/.test(formatted[i])) {
        count++;
        if (count === charPos) return i + 1;
      }
    }
    return formatted.length;
  },

  format: (raw: string, mask: string): string => {
    if (!raw) return '';

    let result = '';
    let rawIndex = 0;

    for (let i = 0; i < mask.length && rawIndex < raw.length; i++) {
      const maskChar = mask[i];

      if (maskChar === '#') {
        while (rawIndex < raw.length && !/\d/.test(raw[rawIndex])) {
          rawIndex++;
        }
        if (rawIndex < raw.length) {
          result += raw[rawIndex];
          rawIndex++;
        }
      } else if (maskChar === '@') {
        while (rawIndex < raw.length && !/[a-zA-Z]/.test(raw[rawIndex])) {
          rawIndex++;
        }
        if (rawIndex < raw.length) {
          result += raw[rawIndex].toUpperCase();
          rawIndex++;
        }
      } else {
        result += maskChar;
      }
    }

    return result;
  },

  getMaxLength: (mask: string): number => {
    return mask.length;
  },
};
