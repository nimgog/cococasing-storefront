module.exports = {
  client: {
    includes: ['./src/app/graphql/**/*.gql'],
    excludes: [
      '**/node_modules',
      '**/__tests___',
      './src/app/graphql/types/**/*.ts',
    ],
    service: {
      name: 'Shopify Storefront',
      localSchemaFile: './codegen/shopify-schema.json',
    },
  },
};
