import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { SWAGGER_PATH } from './config.ts';
import { listAvailableTags, normalizeTagFilter } from './normalize.ts';
import type { CliOptions, NormalizedOperation } from './types.ts';

const PROMPT_EXAMPLES = [
  'Exemplos no prompt:',
  '  Enter vazio            -> gera tudo',
  '  auth                   -> gera uma tag simples',
  '  user profile           -> gera uma tag com nome composto',
  '  admin/settings         -> gera uma tag aninhada',
  '  auth, admin/settings   -> gera multiplas tags',
];

export function parseCliArgs(args: string[]): CliOptions {
  let help = false;

  for (const argument of args) {
    if (argument === '--help' || argument === '-h') {
      help = true;
      continue;
    }

    throw new Error(`Opcao desconhecida: ${argument}`);
  }

  return { help };
}

export function printHelp() {
  console.log(`Uso: node scripts/generate-api.ts

Opcoes:
  -h, --help        Exibir esta mensagem de ajuda.

Fluxo de geracao:
  1. O script sempre pergunta "Tags (Enter para gerar tudo):"
  2. Enter vazio gera todos os escopos
  3. Um valor gera apenas o escopo/tag informado
  4. Valores separados por virgula geram a uniao das tags informadas
  5. Tag invalida encerra a execucao com erro

Resolucao da fonte:
  1. VITE_API_BASE_URL do .env / .env.local + ${SWAGGER_PATH}

${PROMPT_EXAMPLES.join('\n')}

Exemplo:
  node scripts/generate-api.ts`);
}

export async function promptTagFilters(operations: NormalizedOperation[]): Promise<string[] | undefined> {
  if (!input.isTTY || !output.isTTY) {
    throw new Error(
      'Este script exige terminal interativo para selecionar tags. Execute em um terminal e informe as tags (ou Enter para gerar tudo).',
    );
  }

  const availableTags = listAvailableTags(operations);
  const readline = createInterface({ input, output });

  try {
    console.log(PROMPT_EXAMPLES.join('\n'));

    const enteredTags = parseEnteredTags(await readline.question('Tags (Enter para gerar tudo): '));

    if (!enteredTags.length) {
      return undefined;
    }

    const invalidTags = enteredTags.filter((tag) => {
      const normalizedTag = normalizeTagFilter(tag);
      return !operations.some(
        (operation) => operation.scopeKey === normalizedTag || operation.scopePath.includes(normalizedTag),
      );
    });

    if (invalidTags.length) {
      throw new Error(`Tags invalidas: ${invalidTags.join(', ')}. Tags disponiveis: ${availableTags.join(', ')}`);
    }

    return enteredTags;
  } finally {
    readline.close();
  }
}

function parseEnteredTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  );
}
