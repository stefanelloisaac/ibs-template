import fs from 'node:fs/promises';
import path from 'node:path';
import { ESLint } from 'eslint';
import prettier from 'prettier';
import { GENERATED_DIR, GENERATED_HEADER, ROOT } from './config.ts';
import { dereferenceSchema, getRefName, isReference } from './normalize.ts';
import type { NormalizedOperation, OpenAPIInlineSchema, OpenAPIParameter, OpenAPISchema } from './types.ts';

export async function generateScopedFiles(
  grouped: Map<string, NormalizedOperation[]>,
  components: Record<string, OpenAPISchema>,
) {
  const generatedFiles: string[] = [];

  generatedFiles.push(await writeGeneratedResponseSupportFile());

  for (const [scopeKey, scopeOperations] of grouped.entries()) {
    generatedFiles.push(...(await generateModuleFiles(scopeKey, scopeOperations, components)));
  }

  if (generatedFiles.length) {
    await runEslintFixes(generatedFiles);
  }

  return generatedFiles;
}

async function generateModuleFiles(
  scopeKey: string,
  operations: NormalizedOperation[],
  components: Record<string, OpenAPISchema>,
) {
  const module = generateModuleContents(scopeKey, operations, components);

  if (!module) {
    return [];
  }

  await fs.mkdir(module.scopeDir, { recursive: true });

  await writeFormatted(module.contractFile, module.contractContent);
  await writeFormatted(module.typesFile, module.typesContent);
  await writeFormatted(module.keysFile, module.keysContent);
  await writeFormatted(module.apiFile, module.apiContent);
  await writeFormatted(module.queriesFile, module.queriesContent);
  await writeFormatted(module.mutationsFile, module.mutationsContent);
  await writeFormatted(module.indexFile, module.indexContent);

  return [
    module.contractFile,
    module.typesFile,
    module.keysFile,
    module.apiFile,
    module.queriesFile,
    module.mutationsFile,
    module.indexFile,
  ];
}

export function generateModuleContents(
  scopeKey: string,
  operations: NormalizedOperation[],
  components: Record<string, OpenAPISchema>,
) {
  const [firstOperation] = operations;

  if (!firstOperation) {
    return null;
  }

  resolveOperationTypeBaseNames(operations, components);

  const scopeDir = path.join(GENERATED_DIR, ...firstOperation.scopePath);
  const fileBaseName = firstOperation.scopeName;
  const hookNames = buildHookNames(operations);

  return {
    scopeDir,
    fileBaseName,
    contractFile: path.join(scopeDir, `${fileBaseName}.contract.ts`),
    typesFile: path.join(scopeDir, `${fileBaseName}.types.ts`),
    keysFile: path.join(scopeDir, `${fileBaseName}.keys.ts`),
    apiFile: path.join(scopeDir, `${fileBaseName}.api.ts`),
    queriesFile: path.join(scopeDir, `${fileBaseName}.queries.ts`),
    mutationsFile: path.join(scopeDir, `${fileBaseName}.mutations.ts`),
    indexFile: path.join(scopeDir, 'index.ts'),
    contractContent: generateContractContent(fileBaseName, firstOperation.scopePath, operations, components),
    typesContent: generateTypesContent(scopeKey, operations, components),
    keysContent: generateKeysContent(firstOperation.scopePath, operations),
    apiContent: generateApiContent(fileBaseName, firstOperation.scopePath, operations),
    queriesContent: generateQueriesContent(firstOperation.scopePath, fileBaseName, operations, hookNames),
    mutationsContent: generateMutationsContent(firstOperation.scopePath, fileBaseName, operations, hookNames),
    indexContent: generateIndexContent(fileBaseName),
  };
}

async function writeFormatted(filePath: string, content: string) {
  const config = await prettier.resolveConfig(filePath);
  const formatted = await prettier.format(content, {
    ...config,
    parser: 'typescript',
  });

  await fs.writeFile(filePath, formatted, 'utf8');
}

async function runEslintFixes(filePaths: string[]) {
  const eslint = new ESLint({
    cwd: ROOT,
    fix: true,
  });
  const filesToLint = filePaths.map((filePath) => path.relative(ROOT, filePath));
  const results = await eslint.lintFiles(filesToLint);

  await ESLint.outputFixes(results);
}

async function writeGeneratedResponseSupportFile() {
  const supportDir = path.join(GENERATED_DIR, 'support');
  const supportFile = path.join(supportDir, 'generated-response.ts');

  await fs.mkdir(supportDir, { recursive: true });
  await writeFormatted(
    supportFile,
    [
      GENERATED_HEADER,
      'export type GeneratedApiResponse<TData = never, TMeta = never> = {',
      '  success: boolean | null;',
      '  message: string | null;',
      '  data: TData | null;',
      '  meta: TMeta | null;',
      '  timestamp: string | null;',
      '};',
      '',
    ].join('\n'),
  );

  return supportFile;
}

export function generateTypesContent(
  scopeKey: string,
  operations: NormalizedOperation[],
  components: Record<string, OpenAPISchema>,
) {
  const usedRefs = new Set<string>();

  for (const operation of operations) {
    for (const refName of operation.usedSchemaRefs) {
      usedRefs.add(refName);
    }
  }

  const supportImportPath = buildGeneratedSupportImportPath(operations[0]?.scopePath ?? []);
  const schemaBlocks = Array.from(usedRefs)
    .sort((left, right) => left.localeCompare(right))
    .map((schemaName) => generateSchemaTypeBlock(schemaName, components[schemaName], components))
    .join('\n\n');

  const operationBlocks = operations
    .slice()
    .sort((left, right) => left.typeBaseName.localeCompare(right.typeBaseName))
    .map((operation) => generateOperationTypeBlock(operation, components))
    .filter(Boolean)
    .join('\n\n');

  return [
    GENERATED_HEADER,
    `import type { GeneratedApiResponse } from '${supportImportPath}';`,
    `// Escopo: ${scopeKey}`,
    '',
    schemaBlocks,
    operationBlocks,
  ]
    .filter(Boolean)
    .join('\n');
}

function generateSchemaTypeBlock(
  schemaName: string,
  schema: OpenAPISchema | undefined,
  components: Record<string, OpenAPISchema>,
): string {
  const resolvedSchema = dereferenceSchema(schema, components);
  const typeValue = schemaToTypeScript(resolvedSchema, components);

  return `export type ${safeTypeName(schemaName)} = ${typeValue};`;
}

function generateOperationTypeBlock(operation: NormalizedOperation, components: Record<string, OpenAPISchema>): string {
  const lines: string[] = [];

  if (operation.pathParams.length) {
    lines.push(
      `export type ${getPathParamsTypeName(operation)} = ${buildParameterObjectType(operation.pathParams, components)};`,
    );
  }

  if (operation.queryParams.length) {
    lines.push(
      `export type ${getQueryParamsTypeName(operation)} = ${buildParameterObjectType(operation.queryParams, components)};`,
    );
  }

  if (operation.headerParams.length) {
    lines.push(
      `export type ${getHeadersTypeName(operation)} = ${buildParameterObjectType(operation.headerParams, components)};`,
    );
  }

  if (shouldEmitRequestBodyAlias(operation, components)) {
    lines.push(
      `export type ${getRequestBodyAliasName(operation)} = ${schemaToTypeScript(operation.requestBodySchema, components)};`,
    );
  }

  if (shouldEmitResponseAlias(operation, components)) {
    lines.push(
      `export type ${getResponseAliasName(operation)} = ${buildGeneratedResponseType(operation, components)};`,
    );
  }

  if (operation.responseDataSchema) {
    lines.push(`export type ${getResponseDataAliasName(operation)} = ${getResponseAliasName(operation)}['data'];`);
  }

  const metaType = getResponseEnvelopePropertyType(operation, components, 'meta');
  if (metaType !== 'never') {
    lines.push(`export type ${getResponseMetaAliasName(operation)} = ${getResponseAliasName(operation)}['meta'];`);
  }

  return lines.join('\n');
}

function buildGeneratedResponseType(operation: NormalizedOperation, components: Record<string, OpenAPISchema>) {
  const dataType = getResponseEnvelopePropertyType(operation, components, 'data');
  const metaType = getResponseEnvelopePropertyType(operation, components, 'meta');

  return `GeneratedApiResponse<${dataType}, ${metaType}>`;
}

function getResponseEnvelopePropertyType(
  operation: NormalizedOperation,
  components: Record<string, OpenAPISchema>,
  propertyName: 'data' | 'meta',
) {
  const propertyInfo = getResponseEnvelopePropertyInfo(operation.responseSchema, components, propertyName);

  return propertyInfo ? schemaToTypeScript(propertyInfo.schema, components) : 'never';
}

type ResponseEnvelopePropertyCandidate = {
  schema: OpenAPISchema;
  required: boolean;
};

function getResponseEnvelopePropertyInfo(
  schema: OpenAPISchema | undefined,
  components: Record<string, OpenAPISchema>,
  propertyName: 'data' | 'meta',
): ResponseEnvelopePropertyCandidate | undefined {
  const candidates = collectResponseEnvelopePropertyCandidates(schema, components, propertyName);

  if (!candidates.length) {
    return undefined;
  }

  const [firstCandidate, ...remainingCandidates] = candidates;

  if (
    remainingCandidates.some((candidate) => !schemasAreEquivalent(firstCandidate.schema, candidate.schema, components))
  ) {
    return undefined;
  }

  return {
    schema: firstCandidate.schema,
    required: candidates.every((candidate) => candidate.required),
  };
}

function collectResponseEnvelopePropertyCandidates(
  schema: OpenAPISchema | undefined,
  components: Record<string, OpenAPISchema>,
  propertyName: 'data' | 'meta',
): ResponseEnvelopePropertyCandidate[] {
  const resolvedSchema = dereferenceSchema(schema, components);

  if (!resolvedSchema || isReference(resolvedSchema)) {
    return [];
  }

  const candidates: ResponseEnvelopePropertyCandidate[] = [];
  const directPropertySchema = resolvedSchema.properties?.[propertyName];
  const isRequired = (resolvedSchema.required ?? []).includes(propertyName);

  if (directPropertySchema) {
    candidates.push({
      schema: directPropertySchema,
      required: isRequired,
    });
  }

  for (const compositeSchema of resolvedSchema.allOf ?? []) {
    candidates.push(...collectResponseEnvelopePropertyCandidates(compositeSchema, components, propertyName));
  }

  for (const unionSchemas of [resolvedSchema.anyOf ?? [], resolvedSchema.oneOf ?? []]) {
    if (!unionSchemas.length) {
      continue;
    }

    const branchCandidates = unionSchemas.map((unionSchema) =>
      collectResponseEnvelopePropertyCandidates(unionSchema, components, propertyName),
    );
    const branchesWithProperty = branchCandidates.filter((entries) => entries.length);

    if (!branchesWithProperty.length) {
      continue;
    }

    if (branchesWithProperty.length !== branchCandidates.length) {
      return [];
    }

    const flattenedCandidates = branchesWithProperty.flat();
    const [firstUnionCandidate, ...remainingUnionCandidates] = flattenedCandidates;

    if (
      remainingUnionCandidates.some(
        (candidate) => !schemasAreEquivalent(firstUnionCandidate.schema, candidate.schema, components),
      )
    ) {
      return [];
    }

    candidates.push(firstUnionCandidate);
  }

  return candidates;
}
function buildParameterObjectType(parameters: OpenAPIParameter[], components: Record<string, OpenAPISchema>): string {
  const lines = parameters.map((parameter) => {
    const propertyName = safeProperty(parameter.name);
    const isRequired = parameter.in === 'path' ? true : Boolean(parameter.required);
    const propertyType = schemaToTypeScript(parameter.schema, components);

    return `${propertyName}${isRequired ? '' : '?'}: ${propertyType};`;
  });

  return `{\n  ${lines.join('\n  ')}\n}`;
}

function buildRequestObjectType(operation: NormalizedOperation, components: Record<string, OpenAPISchema>): string {
  const fields: string[] = [];

  if (operation.pathParams.length) {
    fields.push(`path: ${getPathParamsTypeName(operation)};`);
  }

  if (operation.queryParams.length) {
    fields.push(`query: ${getQueryParamsTypeName(operation)};`);
  }

  if (operation.headerParams.length) {
    fields.push(`headers: ${getHeadersTypeName(operation)};`);
  }

  if (operation.requestBodySchema) {
    fields.push(
      `body${operation.requestBodyRequired ? '' : '?'}: ${getRequestBodyTypeReference(operation, components)};`,
    );
  }

  return `{\n  ${fields.join('\n  ')}\n}`;
}

function hasRequestShape(operation: NormalizedOperation): boolean {
  return Boolean(
    operation.pathParams.length ||
    operation.queryParams.length ||
    operation.headerParams.length ||
    operation.requestBodySchema,
  );
}

function hasRequiredRequestInput(operation: NormalizedOperation): boolean {
  return Boolean(
    operation.pathParams.length ||
    operation.queryParams.some((parameter) => Boolean(parameter.required)) ||
    operation.headerParams.some((parameter) => Boolean(parameter.required)) ||
    (operation.requestBodySchema && operation.requestBodyRequired),
  );
}

function isOptionalRequestInput(operation: NormalizedOperation) {
  return hasRequestShape(operation) && !hasRequiredRequestInput(operation);
}

export function generateContractContent(
  moduleName: string,
  scopePath: string[],
  operations: NormalizedOperation[],
  components: Record<string, OpenAPISchema>,
) {
  const contractTypeName = getContractTypeName(scopePath);
  const sortedOperations = operations
    .slice()
    .sort((left, right) => left.functionName.localeCompare(right.functionName));

  const typeImports = sortedOperations
    .flatMap((operation) => getContractTypeImports(operation, components))
    .filter(unique)
    .sort()
    .join(',\n  ');

  const contractEntries = sortedOperations
    .map((operation) => {
      const method = operation.method.toUpperCase();
      const requestType = getContractRequestType(operation, components);
      const responseType = getResponseTypeReference(operation, components);

      return `  ${operation.functionName}: {\n    method: '${method}';\n    route: '${operation.route}';\n    request: ${requestType};\n    response: ${responseType};\n  };`;
    })
    .join('\n');

  return `${GENERATED_HEADER}
import type {
  ${typeImports}
} from './${moduleName}.types';

export type ${contractTypeName} = {
${contractEntries}
};
`;
}

export function generateKeysContent(scopePath: string[], operations: NormalizedOperation[]) {
  const queries = operations.filter((operation) => operation.method === 'get');
  const scopeVarName = `${safeVar(scopePath.join(' '))}Keys`;
  const scopeTuple = formatLiteralTuple(scopePath);
  const scopeName = scopePath[scopePath.length - 1] ?? scopePath[0] ?? 'shared';
  const contractTypeName = getContractTypeName(scopePath);
  const needsContractImport = queries.some((operation) => hasRequestShape(operation));

  const operationEntries = queries
    .map((operation) => {
      if (hasRequestShape(operation)) {
        const requestType = getContractOperationPropertyType(contractTypeName, operation, 'request');
        const parameter = isOptionalRequestInput(operation) ? `input?: ${requestType}` : `input: ${requestType}`;
        return `${operation.functionName}: (${parameter}) => [...${scopeVarName}.all, '${operation.functionName}', input] as const,`;
      }

      return `${operation.functionName}: () => [...${scopeVarName}.all, '${operation.functionName}'] as const,`;
    })
    .join('\n  ');

  const contractImport = needsContractImport
    ? `import type { ${contractTypeName} } from './${scopeName}.contract';\n\n`
    : '';

  return `${GENERATED_HEADER}
${contractImport}export const ${scopeVarName} = {
  all: ${scopeTuple} as const,
  ${operationEntries}
};
`;
}

export function generateApiContent(moduleName: string, scopePath: string[], operations: NormalizedOperation[]) {
  const contractTypeName = getContractTypeName(scopePath);
  const functions = operations
    .slice()
    .sort((left, right) => left.functionName.localeCompare(right.functionName))
    .map((operation) => generateApiFunction(operation, contractTypeName))
    .join('\n\n');
  const needsHeaderNormalization = operations.some((operation) => operation.headerParams.length);
  const helpers = [
    needsHeaderNormalization
      ? `function normalizeHeaders(headers: Record<string, unknown> | undefined) {
  if (!headers) {
    return undefined;
  }

  const normalized = Object.fromEntries(
    Object.entries(headers)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]),
  );

  return Object.keys(normalized).length ? normalized : undefined;
}`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  return `${GENERATED_HEADER}
import { apiBuildUrl, apiRequest } from '@/core/api';
import type { ${contractTypeName} } from './${moduleName}.contract';

${helpers ? `${helpers}\n\n` : ''}${functions}
`;
}
export function generateQueriesContent(
  scopePath: string[],
  scopeName: string,
  operations: NormalizedOperation[],
  hookNames: Map<string, string>,
) {
  const queries = operations.filter((operation) => operation.method === 'get');

  if (!queries.length) {
    return `${GENERATED_HEADER}\nexport {};`;
  }

  const contractTypeName = getContractTypeName(scopePath);
  const scopeVarName = `${safeVar(scopePath.join(' '))}Keys`;
  const imports = queries
    .map((operation) => operation.functionName)
    .sort()
    .join(',\n  ');
  const factories = queries
    .slice()
    .sort((left, right) => left.functionName.localeCompare(right.functionName))
    .map((operation) => generateQueryFactory(scopePath, operation, hookNames, contractTypeName))
    .join('\n\n');

  return `${GENERATED_HEADER}
import { queryOptions, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ApiError } from '@/core/api';
import type { ${contractTypeName} } from './${scopeName}.contract';
import { ${scopeVarName} } from './${scopeName}.keys';
import { ${imports} } from './${scopeName}.api';

${factories}
`;
}

export function generateMutationsContent(
  scopePath: string[],
  scopeName: string,
  operations: NormalizedOperation[],
  hookNames: Map<string, string>,
) {
  const mutations = operations.filter((operation) => operation.method !== 'get');

  if (!mutations.length) {
    return `${GENERATED_HEADER}\nexport {};`;
  }

  const contractTypeName = getContractTypeName(scopePath);
  const imports = mutations
    .map((operation) => operation.functionName)
    .sort()
    .join(',\n  ');
  const factories = mutations
    .slice()
    .sort((left, right) => left.functionName.localeCompare(right.functionName))
    .map((operation) => generateMutationFactory(scopePath, operation, hookNames, contractTypeName))
    .join('\n\n');

  return `${GENERATED_HEADER}
import { mutationOptions, useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiError } from '@/core/api';
import type { ${contractTypeName} } from './${scopeName}.contract';
import { ${imports} } from './${scopeName}.api';

type MutationInput<T> = [T] extends [never] ? void : T;

${factories}
`;
}

export function generateIndexContent(moduleName: string) {
  return `${GENERATED_HEADER}
export * from './${moduleName}.keys';
export * from './${moduleName}.mutations';
export * from './${moduleName}.queries';
export * from './${moduleName}.types';
`;
}

function generateApiFunction(operation: NormalizedOperation, contractTypeName: string): string {
  const parameter = getFunctionParameterDeclaration(operation, contractTypeName, 'request');
  const urlOptions = buildUrlOptionsExpression(operation);
  const initObject = buildRequestInitExpression(operation);
  const responseType = getContractOperationPropertyType(contractTypeName, operation, 'response');
  const jsDoc = buildOperationJsDoc(operation);

  return `${jsDoc}export async function ${operation.functionName}(${parameter}): Promise<${responseType}> {
  const response = await apiRequest<${responseType}>(
    apiBuildUrl('${operation.route}'${urlOptions}),
    ${initObject},
  );
  return response;
}`;
}

function buildUrlOptionsExpression(operation: NormalizedOperation): string {
  const parts: string[] = [];

  if (operation.pathParams.length) {
    parts.push(`path: ${readInputProperty(operation, 'path')}`);
  }

  if (operation.queryParams.length) {
    parts.push(`query: ${readInputProperty(operation, 'query')}`);
  }

  return parts.length ? `, { ${parts.join(', ')} }` : '';
}

function buildRequestInitExpression(operation: NormalizedOperation): string {
  const lines = [`method: '${operation.method.toUpperCase()}'`];

  if (operation.headerParams.length) {
    lines.push(`headers: normalizeHeaders(${readInputProperty(operation, 'headers')})`);
  }

  if (operation.requestBodySchema) {
    lines.push(`body: ${readInputProperty(operation, 'body')}`);
  }

  return `{
      ${lines.join(',\n      ')}
    }`;
}

function generateQueryFactory(
  scopePath: string[],
  operation: NormalizedOperation,
  hookNames: Map<string, string>,
  contractTypeName: string,
): string {
  const queryOptionsTypeName = getQueryOptionsTypeName(operation);
  const hookName = hookNames.get(getOperationKey(operation));
  const scopeVarName = `${safeVar(scopePath.join(' '))}Keys`;
  const requestType = getContractOperationPropertyType(contractTypeName, operation, 'request');
  const responseType = getContractOperationPropertyType(contractTypeName, operation, 'response');
  const parameter = getFunctionParameterDeclaration(operation, contractTypeName, 'request');
  const keyCall = hasRequestShape(operation)
    ? `${scopeVarName}.${operation.functionName}(input)`
    : `${scopeVarName}.${operation.functionName}()`;
  const functionCall = hasRequestShape(operation) ? `${operation.functionName}(input)` : `${operation.functionName}()`;
  const jsDoc = buildOperationJsDoc(operation);
  const hookParameters = hasRequestShape(operation)
    ? `${isOptionalRequestInput(operation) ? `input?: ${requestType}` : `input: ${requestType}`},\n  options?: ${queryOptionsTypeName}`
    : `options?: ${queryOptionsTypeName}`;
  const queryFactoryCall = hasRequestShape(operation)
    ? `${operation.functionName}Query(input)`
    : `${operation.functionName}Query()`;

  return `${jsDoc}type ${queryOptionsTypeName} = Omit<
  UseQueryOptions<
    ${responseType},
    ApiError,
    ${responseType},
    ReturnType<typeof ${scopeVarName}.${operation.functionName}>
  >,
  'queryKey' | 'queryFn' | 'select'
>;

function ${operation.functionName}Query(${parameter}): UseQueryOptions<
  ${responseType},
  ApiError,
  ${responseType},
  ReturnType<typeof ${scopeVarName}.${operation.functionName}>
> {
  return queryOptions<
    ${responseType},
    ApiError,
    ${responseType},
    ReturnType<typeof ${scopeVarName}.${operation.functionName}>
  >({
    queryKey: ${keyCall},
    queryFn: () => ${functionCall},
  });
}

export function ${hookName}(${hookParameters}) {
  return useQuery({
    ...${queryFactoryCall},
    ...options,
  });
}`;
}

function generateMutationFactory(
  scopePath: string[],
  operation: NormalizedOperation,
  hookNames: Map<string, string>,
  contractTypeName: string,
): string {
  const mutationOptionsTypeName = getMutationOptionsTypeName(operation);
  const hookName = hookNames.get(getOperationKey(operation));
  const mutationKey = formatLiteralTuple([...scopePath, operation.functionName]);
  const requestType = getContractOperationPropertyType(contractTypeName, operation, 'request');
  const responseType = getContractOperationPropertyType(contractTypeName, operation, 'response');
  const parameter = getFunctionParameterDeclaration(operation, contractTypeName, 'request');
  const functionCall = hasRequestShape(operation) ? `${operation.functionName}(input)` : `${operation.functionName}()`;
  const mutationVariablesType = `MutationInput<${getMutationVariablesType(operation, requestType)}>`;
  const jsDoc = buildOperationJsDoc(operation);

  return `${jsDoc}type ${mutationOptionsTypeName} = Omit<
  UseMutationOptions<
    ${responseType},
    ApiError,
    ${mutationVariablesType},
    unknown
  >,
  'mutationKey' | 'mutationFn'
>;

function ${operation.functionName}Mutation() {
  return mutationOptions<
    ${responseType},
    ApiError,
    ${mutationVariablesType},
    unknown
  >({
    mutationKey: ${mutationKey},
    mutationFn: async (${parameter}) => ${functionCall},
  });
}

export function ${hookName}(options?: ${mutationOptionsTypeName}) {
  return useMutation({
    ...${operation.functionName}Mutation(),
    ...options,
  });
}`;
}

export function buildHookNames(operations: NormalizedOperation[]) {
  const counts = new Map<string, number>();

  for (const operation of operations) {
    const baseName = getBaseHookName(operation);
    counts.set(baseName, (counts.get(baseName) ?? 0) + 1);
  }

  const hookNames = new Map<string, string>();

  for (const operation of operations) {
    const baseName = getBaseHookName(operation);
    const hookName = counts.get(baseName) === 1 ? baseName : `${baseName}${pascalCase(operation.method)}`;

    hookNames.set(getOperationKey(operation), hookName);
  }

  return hookNames;
}

function getBaseHookName(operation: NormalizedOperation) {
  return `use${pascalCase(operation.scopePath.join(' '))}${pascalCase(operation.functionName)}`;
}

function getOperationKey(operation: NormalizedOperation) {
  return `${operation.method}:${operation.route}:${operation.operationId}`;
}

function buildOperationJsDoc(operation: NormalizedOperation): string {
  const rawLines = [
    ...(operation.summary ? [operation.summary] : []),
    ...normalizeDescriptionLines(operation.description, operation.summary),
  ];

  if (!rawLines.length) {
    return '';
  }

  const lines = rawLines.map((line) => sanitizeJsDocLine(line));

  return `/**
${lines.map((line) => (line ? ` * ${line}` : ' *')).join('\n')}
 */
`;
}

function normalizeDescriptionLines(description?: string, summary?: string): string[] {
  if (!description) {
    return [];
  }

  const cleanedDescription = description.trim();
  if (!cleanedDescription) {
    return [];
  }

  const cleanedSummary = summary?.trim();
  const descriptionLines = cleanedDescription.split(/\r?\n/).map((line) => line.trimEnd());

  if (cleanedSummary && descriptionLines.length === 1 && descriptionLines[0].trim() === cleanedSummary) {
    return [];
  }

  return cleanedSummary ? ['', ...descriptionLines] : descriptionLines;
}

function sanitizeJsDocLine(line: string) {
  return line.replace(/\*\//g, '*\\/');
}

function getContractTypeImports(operation: NormalizedOperation, components: Record<string, OpenAPISchema>): string[] {
  const imports = new Set<string>();

  if (operation.pathParams.length) {
    imports.add(getPathParamsTypeName(operation));
  }

  if (operation.queryParams.length) {
    imports.add(getQueryParamsTypeName(operation));
  }

  if (operation.headerParams.length) {
    imports.add(getHeadersTypeName(operation));
  }

  addTypeImportCandidate(imports, getRequestBodyTypeReference(operation, components));
  addTypeImportCandidate(imports, getResponseTypeReference(operation, components));

  return Array.from(imports);
}

function addTypeImportCandidate(imports: Set<string>, typeReference: string) {
  if (/^[A-Z_$][A-Za-z0-9_$]*$/.test(typeReference)) {
    imports.add(typeReference);
  }
}

function getContractTypeName(scopePath: string[]) {
  return `${safeTypeName(scopePath.join(' '))}ApiContract`;
}

function getContractRequestType(operation: NormalizedOperation, components: Record<string, OpenAPISchema>) {
  return hasRequestShape(operation) ? buildRequestObjectType(operation, components) : 'never';
}

function getContractOperationPropertyType(
  contractTypeName: string,
  operation: NormalizedOperation,
  property: 'request' | 'response',
) {
  return `${contractTypeName}['${operation.functionName}']['${property}']`;
}

function getFunctionParameterDeclaration(
  operation: NormalizedOperation,
  contractTypeName: string,
  property: 'request',
) {
  if (!hasRequestShape(operation)) {
    return '';
  }

  const requestType = getContractOperationPropertyType(contractTypeName, operation, property);
  return isOptionalRequestInput(operation) ? `input?: ${requestType}` : `input: ${requestType}`;
}

function getMutationVariablesType(operation: NormalizedOperation, requestType: string) {
  if (!hasRequestShape(operation)) {
    return 'never';
  }

  return isOptionalRequestInput(operation) ? `${requestType} | undefined` : requestType;
}

function readInputProperty(operation: NormalizedOperation, property: 'path' | 'query' | 'headers' | 'body') {
  return isOptionalRequestInput(operation) ? `input?.${property}` : `input.${property}`;
}
export function schemaToTypeScript(
  schema: OpenAPISchema | undefined,
  components: Record<string, OpenAPISchema>,
): string {
  if (!schema) {
    return 'void';
  }

  if (isReference(schema)) {
    const refName = getRefName(schema.$ref);
    return refName ? safeTypeName(refName) : 'unknown';
  }

  const compositeType = renderCompositeType(schema, components);
  if (compositeType) {
    return applyNullable(compositeType, schema.nullable);
  }

  if (schema.enum?.length) {
    const enumType = schema.enum.map((value) => JSON.stringify(value)).join(' | ');
    return applyNullable(enumType, schema.nullable);
  }

  if (schema.type === 'array') {
    const itemType = schemaToTypeScript(schema.items, components);
    return applyNullable(`Array<${itemType}>`, schema.nullable);
  }

  if (schema.type === 'object' || schema.properties || schema.additionalProperties) {
    const objectType = renderObjectType(schema, components);
    return applyNullable(objectType, schema.nullable);
  }

  if (schema.type) {
    return applyNullable(mapPrimitiveType(schema.type, schema.format), schema.nullable);
  }

  return applyNullable('unknown', schema.nullable);
}

function renderCompositeType(
  schema: OpenAPIInlineSchema,
  components: Record<string, OpenAPISchema>,
): string | undefined {
  const ownObjectType = hasOwnObjectMembers(schema) ? renderObjectType(schema, components) : undefined;

  if (schema.allOf?.length) {
    const parts = schema.allOf.map((entry) => parenthesize(schemaToTypeScript(entry, components)));

    if (ownObjectType) {
      parts.push(parenthesize(ownObjectType));
    }

    return parts.join(' & ');
  }

  if (schema.anyOf?.length) {
    const unionType = schema.anyOf.map((entry) => parenthesize(schemaToTypeScript(entry, components))).join(' | ');
    return ownObjectType ? `${parenthesize(ownObjectType)} & (${unionType})` : unionType;
  }

  if (schema.oneOf?.length) {
    const unionType = schema.oneOf.map((entry) => parenthesize(schemaToTypeScript(entry, components))).join(' | ');
    return ownObjectType ? `${parenthesize(ownObjectType)} & (${unionType})` : unionType;
  }

  return undefined;
}

function hasOwnObjectMembers(schema: OpenAPIInlineSchema) {
  return Boolean(Object.keys(schema.properties ?? {}).length || schema.additionalProperties);
}

function renderObjectType(schema: OpenAPIInlineSchema, components: Record<string, OpenAPISchema>): string {
  const requiredProperties = new Set(schema.required ?? []);
  const lines = Object.entries(schema.properties ?? {}).map(([propertyName, propertySchema]) => {
    const propertyType = schemaToTypeScript(propertySchema, components);
    const isRequired = requiredProperties.has(propertyName);

    return `${safeProperty(propertyName)}${isRequired ? '' : '?'}: ${propertyType};`;
  });

  if (schema.additionalProperties) {
    const additionalValueType =
      schema.additionalProperties === true ? 'unknown' : schemaToTypeScript(schema.additionalProperties, components);

    lines.push(`[key: string]: ${additionalValueType};`);
  }

  if (!lines.length) {
    return 'Record<string, unknown>';
  }

  return `{\n  ${lines.join('\n  ')}\n}`;
}

function mapPrimitiveType(type: string, format?: string): string {
  switch (type) {
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
      return format === 'binary' ? 'Blob' : 'string';
    case 'null':
      return 'null';
    default:
      return 'unknown';
  }
}

function parenthesize(value: string): string {
  if (value.startsWith('{') || value.startsWith('Array<') || value === 'unknown') {
    return value;
  }

  return `(${value})`;
}

function applyNullable(typeValue: string, nullable?: boolean) {
  return nullable ? `${typeValue} | null` : typeValue;
}

function schemasAreEquivalent(
  left: OpenAPISchema | undefined,
  right: OpenAPISchema | undefined,
  components: Record<string, OpenAPISchema>,
) {
  return (
    JSON.stringify(dereferenceSchema(left, components) ?? null) ===
    JSON.stringify(dereferenceSchema(right, components) ?? null)
  );
}

function schemaUsesAliasName(schema: OpenAPISchema | undefined, aliasName: string) {
  if (!schema || !isReference(schema)) {
    return false;
  }

  const refName = getRefName(schema.$ref);
  return refName ? safeTypeName(refName) === aliasName : false;
}

function resolveOperationTypeBaseNames(operations: NormalizedOperation[], components: Record<string, OpenAPISchema>) {
  const reservedNames = new Set<string>();

  for (const operation of operations) {
    for (const refName of operation.usedSchemaRefs) {
      reservedNames.add(safeTypeName(refName));
    }
  }

  const sortedOperations = operations
    .slice()
    .sort(
      (left, right) =>
        safeTypeName(left.typeBaseName).localeCompare(safeTypeName(right.typeBaseName)) ||
        left.method.localeCompare(right.method) ||
        left.route.localeCompare(right.route) ||
        left.operationId.localeCompare(right.operationId),
    );

  for (const operation of sortedOperations) {
    const baseName = safeTypeName(operation.typeBaseName);
    const candidates = buildTypeBaseNameCandidates(operation, baseName);

    let resolvedBaseName = candidates.find((candidate) =>
      canUseTypeBaseName(operation, candidate, components, reservedNames),
    );

    if (!resolvedBaseName) {
      let index = 2;

      while (!resolvedBaseName) {
        const numericCandidate = `${baseName}${index}`;
        if (canUseTypeBaseName(operation, numericCandidate, components, reservedNames)) {
          resolvedBaseName = numericCandidate;
        }
        index += 1;
      }
    }

    operation.typeBaseName = resolvedBaseName;

    for (const typeName of getReservedTypeNamesForOperation(operation, components)) {
      reservedNames.add(typeName);
    }
  }
}

function buildTypeBaseNameCandidates(operation: NormalizedOperation, baseName: string) {
  const methodSuffix = pascalCase(operation.method);
  const routeSuffix = pascalCase(operation.route.replace(/[{}]/g, '').split('/').filter(Boolean).join(' '));
  const operationSuffix = pascalCase(operation.operationId);

  return [
    baseName,
    `${baseName}${methodSuffix}`,
    `${baseName}${operationSuffix}`,
    `${baseName}${routeSuffix}`,
    `${baseName}${methodSuffix}${routeSuffix}`,
  ].filter(unique);
}

function canUseTypeBaseName(
  operation: NormalizedOperation,
  candidateBaseName: string,
  components: Record<string, OpenAPISchema>,
  reservedNames: Set<string>,
) {
  for (const typeName of getReservedTypeNamesForOperation(operation, components, candidateBaseName)) {
    if (reservedNames.has(typeName)) {
      return false;
    }
  }

  return true;
}

function getReservedTypeNamesForOperation(
  operation: NormalizedOperation,
  components: Record<string, OpenAPISchema>,
  typeBaseName = operation.typeBaseName,
) {
  void components;
  const names = new Set<string>();

  if (operation.pathParams.length) {
    names.add(`${safeTypeName(typeBaseName)}PathParams`);
  }

  if (operation.queryParams.length) {
    names.add(`${safeTypeName(typeBaseName)}QueryParams`);
  }

  if (operation.headerParams.length) {
    names.add(`${safeTypeName(typeBaseName)}Headers`);
  }

  if (
    operation.requestBodySchema &&
    !schemaUsesAliasName(operation.requestBodySchema, `${safeTypeName(typeBaseName)}Body`)
  ) {
    names.add(`${safeTypeName(typeBaseName)}Body`);
  }

  if (!schemaUsesAliasName(operation.responseSchema, `${safeTypeName(typeBaseName)}Response`)) {
    names.add(`${safeTypeName(typeBaseName)}Response`);
  }

  if (operation.method === 'get') {
    names.add(`${safeTypeName(typeBaseName)}QueryOptions`);
  } else {
    names.add(`${safeTypeName(typeBaseName)}MutationOptions`);
  }

  return Array.from(names);
}

function getPathParamsTypeName(operation: NormalizedOperation) {
  return `${safeTypeName(operation.typeBaseName)}PathParams`;
}

function getQueryParamsTypeName(operation: NormalizedOperation) {
  return `${safeTypeName(operation.typeBaseName)}QueryParams`;
}

function getHeadersTypeName(operation: NormalizedOperation) {
  return `${safeTypeName(operation.typeBaseName)}Headers`;
}

function getRequestBodyAliasName(operation: NormalizedOperation) {
  return `${safeTypeName(operation.typeBaseName)}Body`;
}

function getResponseAliasName(operation: NormalizedOperation) {
  return `${safeTypeName(operation.typeBaseName)}Response`;
}

function getResponseDataAliasName(operation: NormalizedOperation) {
  return `${safeTypeName(operation.typeBaseName)}Data`;
}

function getResponseMetaAliasName(operation: NormalizedOperation) {
  return `${safeTypeName(operation.typeBaseName)}Meta`;
}

function getQueryOptionsTypeName(operation: NormalizedOperation) {
  return `${safeTypeName(operation.typeBaseName)}QueryOptions`;
}

function getMutationOptionsTypeName(operation: NormalizedOperation) {
  return `${safeTypeName(operation.typeBaseName)}MutationOptions`;
}

function shouldEmitRequestBodyAlias(operation: NormalizedOperation, components: Record<string, OpenAPISchema>) {
  void components;
  return (
    Boolean(operation.requestBodySchema) &&
    !schemaUsesAliasName(operation.requestBodySchema, getRequestBodyAliasName(operation))
  );
}

function shouldEmitResponseAlias(operation: NormalizedOperation, components: Record<string, OpenAPISchema>) {
  void operation;
  void components;
  return true;
}

function getRequestBodyTypeReference(operation: NormalizedOperation, components: Record<string, OpenAPISchema>) {
  if (!operation.requestBodySchema) {
    return 'never';
  }

  return shouldEmitRequestBodyAlias(operation, components)
    ? getRequestBodyAliasName(operation)
    : schemaToTypeScript(operation.requestBodySchema, components);
}

function getResponseTypeReference(operation: NormalizedOperation, components: Record<string, OpenAPISchema>) {
  void components;
  return getResponseAliasName(operation);
}

function buildGeneratedSupportImportPath(scopePath: string[]) {
  return `${'../'.repeat(scopePath.length || 1)}support/generated-response`;
}
function safeTypeName(name: string) {
  const sanitized = pascalCase(name.replace(/[^a-zA-Z0-9]+/g, ' '));
  return sanitized || 'UnnamedType';
}

function safeVar(name: string) {
  return camelCase(pascalCase(name));
}

function formatLiteralTuple(values: string[]) {
  return `[${values.map((value) => `'${value}'`).join(', ')}]`;
}

function safeProperty(name: string) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name) ? name : `'${name}'`;
}

function unique<T>(value: T, index: number, array: T[]) {
  return array.indexOf(value) === index;
}

function pascalCase(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, char: string | undefined) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (_, char: string) => char.toUpperCase());
}

function camelCase(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}
