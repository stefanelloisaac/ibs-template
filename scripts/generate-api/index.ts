import { parseCliArgs, printHelp, promptTagFilters } from './cli.ts';
import { generateScopedFiles } from './generate.ts';
import { buildFilterSummary, groupByScope, normalizeOperations, selectOperationsToGenerate } from './normalize.ts';
import { loadEnvFile, loadOpenApiSpec, resolveDefaultSource } from './source.ts';
import type { GenerationFilters } from './types.ts';

export async function runGenerateApi(args = process.argv.slice(2)) {
  const cliOptions = parseCliArgs(args);

  if (cliOptions.help) {
    printHelp();
    return;
  }

  loadEnvFile();

  const source = resolveDefaultSource();
  const spec = await loadOpenApiSpec(source);
  const components = spec.components ?? {};
  const operations = normalizeOperations(spec, components);
  const schemas = components.schemas ?? {};
  const selectedTags = await promptTagFilters(operations);
  const filters: GenerationFilters = { tags: selectedTags };
  const filteredOperations = selectOperationsToGenerate(operations, filters);
  const grouped = groupByScope(filteredOperations);

  await generateScopedFiles(grouped, schemas);

  console.log(
    `Arquivos de API gerados a partir de ${source}${buildFilterSummary(filters)}: ${Array.from(grouped.keys()).join(
      ', ',
    )}`,
  );
}
