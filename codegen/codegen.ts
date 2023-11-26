import type { CodegenConfig } from '@graphql-codegen/cli';
import * as path from 'path';

const config: CodegenConfig = {
  overwrite: true,
  schema: path.join(__dirname, 'shopify-schema.json'),
  documents: 'src/app/graphql/**/*.gql',
  generates: {
    'src/app/graphql/types/index.ts': {
      plugins: [
        'typescript',
        'typescript-apollo-angular',
        'typescript-operations',
      ],
      config: {
        ngModule: 'src/app/graphql.module#GraphQLModule',
        serviceProvidedInRoot: true,
        useTypeImports: true,
        gqlImport: 'apollo-angular#gql',
        addExplicitOverride: true,
        documentVariableSuffix: '',
      },
    },
  },
};

export default config;
