import { readFileSync } from 'node:fs';
import path from 'node:path';
import { bundle } from '@apidevtools/json-schema-ref-parser';
import { SWAGGER_PATH } from './config.ts';
import type { OpenAPISpec } from './types.ts';

export function loadEnvFile() {
  const envFiles = ['.env', '.env.local'];

  for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);
    let content: string;

    try {
      content = readFileSync(filePath, 'utf-8');
    } catch {
      continue;
    }

    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;

      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed
        .slice(eqIndex + 1)
        .trim()
        .replace(/^['"]|['"]$/g, '');

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

export function resolveDefaultSource() {
  const baseUrl = process.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL nao esta definido. Defina no seu arquivo .env.');
  }

  return baseUrl.replace(/\/+$/, '') + SWAGGER_PATH;
}

export async function loadOpenApiSpec(source: string): Promise<OpenAPISpec> {
  try {
    return await bundle<OpenAPISpec>(source, {
      resolve: {
        http: {
          // Allow local-network Swagger endpoints such as 192.168.x.x during development.
          safeUrlResolver: false,
          timeout: 30_000,
        },
      },
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    throw new Error(`Nao foi possivel carregar o schema OpenAPI de: ${source}\nDetalhes: ${details}`);
  }
}
