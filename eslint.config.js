import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import pluginQuery from '@tanstack/eslint-plugin-query';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

const GENERATED_DEEP_IMPORT = '@/generated/*/**';
const CORE_DEEP_IMPORT = '@/core/*/**';
const MODULE_DEEP_IMPORT = '@/modules/*/**';

function restriction(group, message) {
  return { group, message };
}

function restrictPatterns(patterns) {
  return ['error', { patterns }];
}

const generatedImportRestriction = restriction(
  [GENERATED_DEEP_IMPORT],
  'Manual code must consume generated scopes only through their public barrels.',
);

const coreLayerRestrictions = [
  restriction(['@/app/*', '@/modules/*', '@/shared/*', '@/shell/*'], 'Core must stay infrastructure-only.'),
  restriction([GENERATED_DEEP_IMPORT], 'Core must consume generated code only through public barrels.'),
];

const sharedLayerRestrictions = [
  restriction(
    ['@/app/*', '@/core/*', '@/modules/*', '@/shell/*', 'react-router'],
    'Shared must stay framework-agnostic and app-agnostic.',
  ),
  generatedImportRestriction,
];

const shellLayerRestrictions = [
  restriction(
    ['@/app/*', '@/modules/*'],
    'Shell must stay visual and must not depend on app or business modules directly.',
  ),
  restriction(
    [CORE_DEEP_IMPORT, GENERATED_DEEP_IMPORT],
    'Shell must consume core and generated code only through public barrels.',
  ),
];

const appLayerRestrictions = [
  restriction(
    [CORE_DEEP_IMPORT, MODULE_DEEP_IMPORT, GENERATED_DEEP_IMPORT],
    'App must consume core, module and generated code only through public barrels.',
  ),
];

const modulesLayerRestrictions = [
  restriction(
    ['@/shell/*', MODULE_DEEP_IMPORT, CORE_DEEP_IMPORT, GENERATED_DEEP_IMPORT],
    'Modules must not depend on shell and must consume modules/core/generated only through allowed public contracts.',
  ),
  {
    regex: '^@/app/(?!routing/route\\.types$).+',
    message: 'Modules may only import @/app/routing/route.types from app.',
  },
];

// Base config
const baseConfig = {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
    globals: {
      ...globals.browser,
      ...globals.es2021,
      React: 'readonly',
      RequestInit: 'readonly',
    },
  },
  plugins: {
    '@typescript-eslint': tseslint,
    react,
    'react-hooks': reactHooks,
    import: importPlugin,
    'unused-imports': unusedImports,
  },
  rules: {
    ...tseslint.configs.recommended.rules,
    ...react.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-duplicate-imports': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    react: { version: 'detect' },
  },
};

// Fronteiras de camada
// "Nao pode importar" significa que a dependencia entre camadas e proibida.
// Nesse caso, a camada nao pode consumir nem o barrel publico nem arquivos internos.
//
// "Nao pode fazer deep import" significa que a dependencia entre camadas e permitida,
// mas somente pela superficie publica do modulo/camada.
// Exemplo:
// - permitido: '@/core/session'
// - proibido: '@/core/session/react/session.hooks'
const coreLayerRules = {
  files: ['src/core/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrictPatterns(coreLayerRestrictions),
  },
};

const sharedLayerRules = {
  files: ['src/shared/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrictPatterns(sharedLayerRestrictions),
  },
};

const shellLayerRules = {
  files: ['src/shell/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrictPatterns(shellLayerRestrictions),
  },
};

const appLayerRules = {
  files: ['src/app/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrictPatterns(appLayerRestrictions),
  },
};

const modulesLayerRules = {
  files: ['src/modules/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrictPatterns(modulesLayerRestrictions),
  },
};

// Core file semantics
const coreSupportConfigRules = {
  files: ['src/core/**/support/*.config.ts'],
  rules: {
    'no-restricted-imports': restrictPatterns([
      ...coreLayerRestrictions,
      restriction(
        ['../runtime/*', '../react/*', 'react', 'react-router'],
        'Core config files must stay runtime-agnostic and React-agnostic.',
      ),
    ]),
  },
};

const coreSupportConstantsRules = {
  files: ['src/core/**/support/*.constants.ts'],
  rules: {
    'no-restricted-imports': restrictPatterns([
      ...coreLayerRestrictions,
      restriction(
        ['../runtime/*', '../react/*', 'react', 'react-router'],
        'Core constants files must not depend on runtime or React.',
      ),
    ]),
  },
};

const coreSupportApiRules = {
  files: ['src/core/**/support/*.api.ts'],
  rules: {
    'no-restricted-imports': restrictPatterns([
      ...coreLayerRestrictions,
      restriction(
        ['../runtime/*', '../react/*', 'react', 'react-router'],
        'Core support API files must stay outside runtime and React adapters.',
      ),
    ]),
  },
};

const coreSupportErrorRules = {
  files: ['src/core/**/support/*.error.ts'],
  rules: {
    'no-restricted-imports': restrictPatterns([
      ...coreLayerRestrictions,
      restriction(['../react/*'], 'Core support error files must not depend on React adapters.'),
    ]),
  },
};

const coreRuntimeRules = {
  files: ['src/core/**/runtime/*.bootstrap.ts', 'src/core/**/runtime/*.runtime.ts', 'src/core/**/runtime/*.store.ts'],
  rules: {
    'no-restricted-imports': restrictPatterns([
      ...coreLayerRestrictions,
      restriction(['../react/*', 'react', 'react-router'], 'Core runtime files must stay outside React.'),
    ]),
  },
};

const coreEventsRules = {
  files: ['src/core/**/runtime/*.events.ts'],
  rules: {
    'no-restricted-imports': restrictPatterns([
      ...coreLayerRestrictions,
      restriction(['../react/*', 'react'], 'Core event files must stay outside React adapters.'),
    ]),
  },
};

const coreContextRules = {
  files: ['src/core/**/react/*.context.ts'],
  rules: {
    'no-restricted-imports': restrictPatterns([
      ...coreLayerRestrictions,
      restriction(['../runtime/*', 'react-router'], 'Core context files should only declare context shape.'),
    ]),
  },
};

const coreHooksRules = {
  files: ['src/core/**/react/*.hooks.ts'],
  rules: {
    'no-restricted-imports': restrictPatterns([
      ...coreLayerRestrictions,
      restriction(
        ['../runtime/*.bootstrap', '../runtime/*.client'],
        'Core hooks should not depend directly on bootstrap or client files.',
      ),
    ]),
  },
};

// Environment
const nodeEnvironmentRules = {
  files: ['scripts/**/*.{ts,tsx}', 'vite.config.ts'],
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
};

const ignoreRules = {
  ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'cs-showcase/dist/**'],
};

export default [
  ...pluginQuery.configs['flat/recommended'],
  eslint.configs.recommended,
  baseConfig,
  coreLayerRules,
  sharedLayerRules,
  shellLayerRules,
  appLayerRules,
  modulesLayerRules,
  coreSupportConfigRules,
  coreSupportConstantsRules,
  coreSupportApiRules,
  coreSupportErrorRules,
  coreRuntimeRules,
  coreEventsRules,
  coreContextRules,
  coreHooksRules,
  nodeEnvironmentRules,
  ignoreRules,
  prettier,
];
