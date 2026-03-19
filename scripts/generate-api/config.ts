import path from 'node:path';

export const ROOT = process.cwd();
export const SWAGGER_PATH = '/swagger/yaml';
export const GENERATED_DIR = path.join(ROOT, 'src', 'generated');
export const GENERATED_HEADER = '// Este arquivo foi gerado por scripts/generate-api.ts. Nao edite manualmente.';
