import type {
  GenerationFilters,
  HttpMethod,
  NormalizedOperation,
  OpenAPIComponents,
  OpenAPIOperation,
  OpenAPIParameter,
  OpenAPIPathItem,
  OpenAPIReference,
  OpenAPIRequestBody,
  OpenAPIResponse,
  OpenAPISchema,
  OpenAPISpec,
} from './types.ts';

const SUPPORTED_HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;
const UNSUPPORTED_HTTP_METHODS = ['head', 'options', 'trace'] as const;
const RESERVED_IDENTIFIERS = new Set([
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'new',
  'null',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
]);
const JSON_MEDIA_TYPE_PATTERN = /^application\/(json|[a-z0-9.+-]+\+json)$/i;

type RequestBodyInfo = {
  schema?: OpenAPISchema;
  required: boolean;
};

type ResponseDataInfo = {
  schema: OpenAPISchema;
};

export function normalizeOperations(
  spec: OpenAPISpec,
  components: OpenAPIComponents = spec.components ?? {},
): NormalizedOperation[] {
  const operations: NormalizedOperation[] = [];
  const schemas = components.schemas ?? {};

  for (const [route, pathItem] of Object.entries(spec.paths ?? {})) {
    assertSupportedMethods(route, pathItem);

    const sharedParameters = pathItem.parameters ?? [];

    for (const method of SUPPORTED_HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation) continue;

      const scope = resolveOperationScope(operation.tags, route);
      const operationId = normalizeOperationId(operation.operationId ?? buildOperationId(method, route));
      const typeBaseName = buildOperationTypeBaseName(operation.operationId, method, route);
      const parameters = mergeParameters(sharedParameters, operation.parameters ?? []);
      const operationLabel = `${method.toUpperCase()} ${route}`;

      const pathParams = parameters.filter((parameter) => parameter.in === 'path');
      const queryParams = parameters.filter((parameter) => parameter.in === 'query');
      const headerParams = parameters.filter((parameter) => parameter.in === 'header');
      const cookieParams = parameters.filter((parameter) => parameter.in === 'cookie');

      const requestBody = extractRequestBodyInfo(operation.requestBody, components, operationLabel);
      const responseSchema = extractResponseSchema(operation.responses, components, operationLabel);
      const responseData = extractResponseDataInfo(responseSchema, schemas, operationLabel);

      const usedSchemaRefs = new Set<string>();
      collectSchemaRefs(requestBody.schema, schemas, usedSchemaRefs);
      collectSchemaRefs(responseSchema, schemas, usedSchemaRefs);

      for (const parameter of parameters) {
        collectSchemaRefs(parameter.schema, schemas, usedSchemaRefs);
      }

      operations.push({
        moduleName: scope.moduleName,
        scopeName: scope.scopeName,
        scopePath: scope.scopePath,
        scopeKey: scope.scopeKey,
        method,
        route,
        operationId,
        summary: operation.summary,
        description: operation.description,
        typeBaseName,
        functionName: buildOperationFunctionName(typeBaseName, scope.scopeName),
        pathParams,
        queryParams,
        headerParams,
        cookieParams,
        requestBodySchema: requestBody.schema,
        requestBodyRequired: requestBody.required,
        responseSchema,
        responseDataSchema: responseData?.schema,
        usedSchemaRefs: new Set(usedSchemaRefs),
      });
    }
  }

  resolveOperationFunctionNames(operations);

  return operations;
}

export function selectOperationsToGenerate(
  operations: NormalizedOperation[],
  filters: GenerationFilters,
): NormalizedOperation[] {
  let selectedModules: Set<string> | undefined;

  if (filters.tags?.length) {
    const normalizedTags = filters.tags.map((tag) => normalizeTagFilter(tag));
    const invalidTags = filters.tags.filter((_tag, index) => {
      const normalizedTag = normalizedTags[index];
      return !operations.some((operation) => matchesTagFilter(operation, normalizedTag));
    });

    if (invalidTags.length) {
      throw new Error(
        `Nenhuma operacao encontrada para as tags "${invalidTags.join(', ')}". Tags disponiveis: ${listAvailableTags(operations).join(', ')}`,
      );
    }

    const tagModules = new Set(
      operations
        .filter((operation) => normalizedTags.some((normalizedTag) => matchesTagFilter(operation, normalizedTag)))
        .map((operation) => operation.scopeKey),
    );

    if (!tagModules.size) {
      throw new Error(`Nenhuma operacao encontrada para os filtros${buildFilterSummary(filters)}.`);
    }

    selectedModules = tagModules;
  }

  if (!selectedModules) {
    return operations;
  }

  const selectedOperations = operations.filter((operation) => selectedModules.has(operation.scopeKey));

  if (!selectedOperations.length) {
    throw new Error(`Nenhuma operacao encontrada para os filtros${buildFilterSummary(filters)}.`);
  }

  return selectedOperations;
}

function normalizeTags(tags?: string[], route?: string): string[] {
  const fallbackTag = route?.split('/').filter(Boolean)[0] ?? 'shared';
  const source = tags?.length ? tags : [fallbackTag];

  return source.flatMap((tag) =>
    tag
      .split('/')
      .map((part) => normalizeTagValue(part))
      .filter(Boolean),
  );
}

function resolveOperationScope(tags?: string[], route?: string) {
  const scopePath = normalizeTags(tags, route);
  const moduleName = scopePath[0] ?? 'shared';
  const scopeName = scopePath[scopePath.length - 1] ?? moduleName;

  return {
    moduleName,
    scopeName,
    scopePath,
    scopeKey: scopePath.join('/'),
  };
}

function normalizeTagValue(tag: string): string {
  return tag
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');
}

export function normalizeTagFilter(tag: string): string {
  return tag
    .split('/')
    .map((part) => normalizeTagValue(part))
    .filter(Boolean)
    .join('/');
}

function matchesTagFilter(operation: NormalizedOperation, normalizedTag: string) {
  return operation.scopeKey === normalizedTag || operation.scopePath.includes(normalizedTag);
}

export function listAvailableTags(operations: NormalizedOperation[]) {
  return Array.from(
    new Set(operations.flatMap((operation) => [operation.scopeKey, operation.moduleName, ...operation.scopePath])),
  ).sort();
}

export function buildFilterSummary(filters: GenerationFilters): string {
  const parts: string[] = [];

  if (filters.tags?.length) {
    parts.push(`tags=${filters.tags.map((tag) => normalizeTagFilter(tag)).join(',')}`);
  }

  return parts.length ? ` (${parts.join(', ')})` : '';
}

function normalizeOperationId(value: string): string {
  const cleaned = value
    .replace(/[^a-zA-Z0-9-_]/g, ' ')
    .trim()
    .replace(/[-_\s]+(.)?/g, (_, char: string | undefined) => (char ? char.toUpperCase() : ''));

  return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
}

function buildOperationId(method: string, route: string): string {
  const cleanRoute = route
    .replace(/[{}]/g, '')
    .split('/')
    .filter(Boolean)
    .map((part) => pascalCase(part))
    .join('');

  return `${method}${cleanRoute || 'Root'}`;
}

function buildOperationTypeBaseName(operationId: string | undefined, method: HttpMethod, route: string): string {
  if (operationId) {
    return pascalCase(operationId.replace(/Controller/g, '').replace(/[_-]+/g, ' '));
  }

  return pascalCase(buildOperationId(method, route));
}

function buildOperationFunctionName(typeBaseName: string, moduleName: string): string {
  const modulePrefix = pascalCase(moduleName);
  const normalizedTypeName = safeTypeName(typeBaseName);

  if (normalizedTypeName.startsWith(modulePrefix) && normalizedTypeName.length > modulePrefix.length) {
    return safeIdentifierName(camelCase(normalizedTypeName.slice(modulePrefix.length)));
  }

  return safeIdentifierName(camelCase(normalizedTypeName));
}

function resolveOperationFunctionNames(operations: NormalizedOperation[]) {
  const operationsByScope = new Map<string, NormalizedOperation[]>();

  for (const operation of operations) {
    const list = operationsByScope.get(operation.scopeKey) ?? [];
    list.push(operation);
    operationsByScope.set(operation.scopeKey, list);
  }

  for (const scopeOperations of operationsByScope.values()) {
    const baseNameCounts = new Map<string, number>();

    for (const operation of scopeOperations) {
      baseNameCounts.set(operation.functionName, (baseNameCounts.get(operation.functionName) ?? 0) + 1);
    }

    const usedNames = new Set<string>();
    const sortedOperations = scopeOperations
      .slice()
      .sort(
        (left, right) =>
          left.functionName.localeCompare(right.functionName) ||
          left.method.localeCompare(right.method) ||
          left.route.localeCompare(right.route) ||
          left.operationId.localeCompare(right.operationId),
      );

    for (const operation of sortedOperations) {
      const baseName = operation.functionName;

      if ((baseNameCounts.get(baseName) ?? 0) === 1 && !usedNames.has(baseName)) {
        usedNames.add(baseName);
        continue;
      }

      const collisionBase = `${baseName}${pascalCase(operation.method)}`;
      const routeSuffix = pascalCase(operation.route.replace(/[{}]/g, '').split('/').filter(Boolean).join(' '));
      const operationSuffix = pascalCase(operation.operationId);
      const candidates = [collisionBase, `${collisionBase}${operationSuffix}`, `${collisionBase}${routeSuffix}`].filter(
        Boolean,
      );

      let resolvedName = candidates[0] ?? `${baseName}${pascalCase(operation.method)}`;

      for (const candidate of candidates) {
        if (!usedNames.has(candidate)) {
          resolvedName = safeIdentifierName(candidate);
          break;
        }
      }

      if (usedNames.has(resolvedName)) {
        let index = 2;
        const uniqueBase = resolvedName;

        while (usedNames.has(`${uniqueBase}${index}`)) {
          index += 1;
        }

        resolvedName = `${uniqueBase}${index}`;
      }

      operation.functionName = resolvedName;
      usedNames.add(resolvedName);
    }
  }
}

function assertSupportedMethods(route: string, pathItem: OpenAPIPathItem) {
  for (const key of Object.keys(pathItem)) {
    if ((UNSUPPORTED_HTTP_METHODS as readonly string[]).includes(key)) {
      throw new Error(`Metodo HTTP nao suportado em ${route}: ${key}.`);
    }
  }
}

function mergeParameters(pathItemParameters: OpenAPIParameter[], operationParameters: OpenAPIParameter[]) {
  const merged = new Map<string, OpenAPIParameter>();

  for (const parameter of [...pathItemParameters, ...operationParameters]) {
    merged.set(`${parameter.in}:${parameter.name}`, parameter);
  }

  return Array.from(merged.values());
}

function pascalCase(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, char: string | undefined) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (_, char: string) => char.toUpperCase());
}

function camelCase(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function safeIdentifierName(name: string) {
  return RESERVED_IDENTIFIERS.has(name) ? `${name}Action` : name;
}

function safeTypeName(name: string) {
  const sanitized = pascalCase(name.replace(/[^a-zA-Z0-9]+/g, ' '));
  return sanitized || 'UnnamedType';
}

export function isReference(value: unknown): value is OpenAPIReference {
  return Boolean(value && typeof value === 'object' && '$ref' in value && typeof value.$ref === 'string');
}

export function dereferenceSchema(
  schema: OpenAPISchema | undefined,
  components: Record<string, OpenAPISchema>,
): OpenAPISchema | undefined {
  if (!schema) return undefined;
  if (!isReference(schema)) return schema;

  const refName = getRefName(schema.$ref);
  const resolved = refName ? components[refName] : undefined;

  return resolved ? dereferenceSchema(resolved, components) : undefined;
}

function dereferenceComponent<T>(
  value: T | OpenAPIReference | undefined,
  components: Record<string, T | OpenAPIReference> | undefined,
): T | undefined {
  if (!value) {
    return undefined;
  }

  if (!isReference(value)) {
    return value;
  }

  const refName = getRefName(value.$ref);
  const resolved = refName ? components?.[refName] : undefined;

  if (!resolved) {
    return undefined;
  }

  return isReference(resolved) ? dereferenceComponent(resolved, components) : resolved;
}

function extractContentSchema(
  content: OpenAPIRequestBody['content'] | OpenAPIResponse['content'] | undefined,
  contextLabel: string,
) {
  if (!content) {
    return undefined;
  }

  for (const [mediaType, mediaTypeEntry] of Object.entries(content)) {
    if (mediaTypeEntry?.schema && JSON_MEDIA_TYPE_PATTERN.test(mediaType.trim())) {
      return mediaTypeEntry.schema;
    }
  }

  const unsupportedMediaTypes = Object.entries(content)
    .filter(([, mediaTypeEntry]) => Boolean(mediaTypeEntry?.schema))
    .map(([mediaType]) => mediaType);

  if (unsupportedMediaTypes.length) {
    throw new Error(
      `Media type nao suportado ${contextLabel}: ${unsupportedMediaTypes.join(', ')}. Apenas application/json e application/*+json sao suportados.`,
    );
  }

  return undefined;
}

export function extractRequestBodyInfo(
  requestBody: OpenAPIOperation['requestBody'],
  components: OpenAPIComponents,
  operationLabel = 'nesta operacao',
): RequestBodyInfo {
  const resolvedRequestBody = dereferenceComponent(requestBody, components.requestBodies);

  return {
    schema: extractContentSchema(resolvedRequestBody?.content, `em ${operationLabel} (request body)`),
    required: Boolean(resolvedRequestBody?.required),
  };
}

export function extractResponseSchema(
  responses: OpenAPIOperation['responses'],
  components: OpenAPIComponents,
  operationLabel = 'nesta operacao',
): OpenAPISchema | undefined {
  const successStatusCodes = Object.keys(responses ?? {})
    .filter((statusCode) => /^2\d\d$/.test(statusCode))
    .sort((left, right) => Number(left) - Number(right));

  for (const statusCode of successStatusCodes) {
    const resolvedResponse = dereferenceComponent(responses?.[statusCode], components.responses);
    const schema = extractContentSchema(resolvedResponse?.content, `em ${operationLabel} (response ${statusCode})`);

    if (schema) {
      return schema;
    }
  }

  const resolvedDefaultResponse = dereferenceComponent(responses?.default, components.responses);
  return extractContentSchema(resolvedDefaultResponse?.content, `em ${operationLabel} (response default)`);
}

export function extractResponseDataInfo(
  schema: OpenAPISchema | undefined,
  components: Record<string, OpenAPISchema>,
  operationLabel = 'nesta operacao',
): ResponseDataInfo | undefined {
  const candidates = collectResponseDataCandidates(schema, components, operationLabel);

  if (!candidates.length) {
    return undefined;
  }

  const [firstCandidate, ...remainingCandidates] = candidates;

  if (
    remainingCandidates.some((candidate) => !schemasAreEquivalent(firstCandidate.schema, candidate.schema, components))
  ) {
    throw new Error(
      `Response.data ambiguo em ${operationLabel}. Todas as composicoes precisam apontar para o mesmo payload.`,
    );
  }

  return { schema: firstCandidate.schema };
}

type ResponseDataCandidate = {
  schema: OpenAPISchema;
};

function collectResponseDataCandidates(
  schema: OpenAPISchema | undefined,
  components: Record<string, OpenAPISchema>,
  operationLabel: string,
): ResponseDataCandidate[] {
  const resolvedSchema = dereferenceSchema(schema, components);

  if (!resolvedSchema || isReference(resolvedSchema)) {
    return [];
  }

  const candidates: ResponseDataCandidate[] = [];
  const directDataSchema = resolvedSchema.properties?.data;

  if (directDataSchema) {
    candidates.push({ schema: directDataSchema });
  }

  for (const compositeSchema of resolvedSchema.allOf ?? []) {
    candidates.push(...collectResponseDataCandidates(compositeSchema, components, operationLabel));
  }

  for (const [unionKind, unionSchemas] of [
    ['anyOf', resolvedSchema.anyOf ?? []],
    ['oneOf', resolvedSchema.oneOf ?? []],
  ] as const) {
    if (!unionSchemas.length) {
      continue;
    }

    const branchCandidates = unionSchemas.map((unionSchema) =>
      collectResponseDataCandidates(unionSchema, components, operationLabel),
    );
    const branchesWithData = branchCandidates.filter((entries) => entries.length);

    if (!branchesWithData.length) {
      continue;
    }

    if (branchesWithData.length !== branchCandidates.length) {
      throw new Error(
        `Response.data ambiguo em ${operationLabel}. Todos os ramos de ${unionKind} precisam definir o mesmo payload.`,
      );
    }

    const flattenedCandidates = branchesWithData.flat();
    const [firstUnionCandidate, ...remainingUnionCandidates] = flattenedCandidates;

    if (
      remainingUnionCandidates.some(
        (candidate) => !schemasAreEquivalent(firstUnionCandidate.schema, candidate.schema, components),
      )
    ) {
      throw new Error(
        `Response.data ambiguo em ${operationLabel}. Todos os ramos de ${unionKind} precisam definir o mesmo payload.`,
      );
    }

    candidates.push(firstUnionCandidate);
  }

  return candidates;
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

function collectSchemaRefs(
  schema: OpenAPISchema | undefined,
  components: Record<string, OpenAPISchema>,
  refs: Set<string>,
) {
  if (!schema) return;

  if (isReference(schema)) {
    const refName = getRefName(schema.$ref);
    if (!refName || refs.has(refName)) return;

    refs.add(refName);
    collectSchemaRefs(components[refName], components, refs);
    return;
  }

  collectSchemaRefs(schema.items, components, refs);

  for (const property of Object.values(schema.properties ?? {})) {
    collectSchemaRefs(property, components, refs);
  }

  if (schema.additionalProperties && schema.additionalProperties !== true) {
    collectSchemaRefs(schema.additionalProperties, components, refs);
  }

  for (const compositeSchema of schema.allOf ?? []) {
    collectSchemaRefs(compositeSchema, components, refs);
  }

  for (const compositeSchema of schema.anyOf ?? []) {
    collectSchemaRefs(compositeSchema, components, refs);
  }

  for (const compositeSchema of schema.oneOf ?? []) {
    collectSchemaRefs(compositeSchema, components, refs);
  }
}

export function getRefName(ref: string): string | undefined {
  const parts = ref.split('/');
  return parts[parts.length - 1];
}

export function groupByScope(operations: NormalizedOperation[]) {
  const grouped = new Map<string, NormalizedOperation[]>();

  for (const operation of operations) {
    const list = grouped.get(operation.scopeKey) ?? [];
    list.push(operation);
    grouped.set(operation.scopeKey, list);
  }

  return grouped;
}
