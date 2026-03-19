export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
export type UnsupportedHttpMethod = 'head' | 'options' | 'trace';

export type OpenAPISpec = {
  paths?: Record<string, OpenAPIPathItem>;
  components?: OpenAPIComponents;
};

export type OpenAPIPathItem = {
  parameters?: OpenAPIParameter[];
  get?: OpenAPIOperation;
  post?: OpenAPIOperation;
  put?: OpenAPIOperation;
  patch?: OpenAPIOperation;
  delete?: OpenAPIOperation;
  head?: OpenAPIOperation;
  options?: OpenAPIOperation;
  trace?: OpenAPIOperation;
};

export type OpenAPIOperation = {
  tags?: string[];
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody | OpenAPIReference;
  responses?: Record<string, OpenAPIResponse | OpenAPIReference>;
};

export type OpenAPIComponents = {
  schemas?: Record<string, OpenAPISchema>;
  responses?: Record<string, OpenAPIResponse | OpenAPIReference>;
  requestBodies?: Record<string, OpenAPIRequestBody | OpenAPIReference>;
};

export type OpenAPIMediaType = {
  schema?: OpenAPISchema;
};

export type OpenAPIRequestBody = {
  required?: boolean;
  content?: Record<string, OpenAPIMediaType>;
};

export type OpenAPIResponse = {
  description?: string;
  content?: Record<string, OpenAPIMediaType>;
};

export type OpenAPIParameter = {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required?: boolean;
  schema?: OpenAPISchema;
};

export type OpenAPIReference = {
  $ref: string;
};

export type OpenAPISchema = OpenAPIReference | OpenAPIInlineSchema;

export type OpenAPIInlineSchema = {
  type?: string;
  format?: string;
  enum?: Array<string | number | boolean | null>;
  items?: OpenAPISchema;
  properties?: Record<string, OpenAPISchema>;
  required?: string[];
  nullable?: boolean;
  additionalProperties?: boolean | OpenAPISchema;
  allOf?: OpenAPISchema[];
  anyOf?: OpenAPISchema[];
  oneOf?: OpenAPISchema[];
};

export type NormalizedOperation = {
  moduleName: string;
  scopeName: string;
  scopePath: string[];
  scopeKey: string;
  method: HttpMethod;
  route: string;
  operationId: string;
  summary?: string;
  description?: string;
  typeBaseName: string;
  functionName: string;
  pathParams: OpenAPIParameter[];
  queryParams: OpenAPIParameter[];
  headerParams: OpenAPIParameter[];
  cookieParams: OpenAPIParameter[];
  requestBodySchema?: OpenAPISchema;
  requestBodyRequired: boolean;
  responseSchema?: OpenAPISchema;
  responseDataSchema?: OpenAPISchema;
  usedSchemaRefs: Set<string>;
};

export type CliOptions = {
  help: boolean;
};

export type GenerationFilters = {
  tags?: string[];
};
