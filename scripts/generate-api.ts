import { runGenerateApi } from './generate-api/index.ts';

runGenerateApi().catch((error) => {
  console.error(error);
  process.exit(1);
});
