export const inputDropzoneUtils = {
  formatFileSize: (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  },

  formatAccept: (accept: string): string => {
    return accept
      .split(',')
      .map((t) => t.trim())
      .map((t) => {
        if (t.startsWith('.')) return t.slice(1).toUpperCase();
        return t;
      })
      .join(', ');
  },
};
