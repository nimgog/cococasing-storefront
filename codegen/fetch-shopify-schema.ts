const { writeFileSync } = require('fs');
const { getIntrospectionQuery } = require('graphql');
const path = require('path');

const { environment } = require('../src/environments/environment');

const fetchSchema = async () => {
  const request: RequestInit = {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': environment.storeFrontAT,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  };

  try {
    const response = await fetch(environment.storeFrontEndpoint, request);

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const { data: schema } = await response.json();
    const schemaPath = path.join(__dirname, 'shopify-schema.json');

    writeFileSync(schemaPath, JSON.stringify(schema));

    console.log('Shopify Storefront GraphQL schema fetched');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

fetchSchema();
