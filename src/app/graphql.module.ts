import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import type { ApolloClientOptions } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({
      uri: environment.storeFrontEndpoint,
      headers: new HttpHeaders().set(
        'X-Shopify-Storefront-Access-Token',
        environment.storeFrontAT
      ),
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache', // Remove this and specify caching options on a query level if needed
      },
      mutate: {
        fetchPolicy: 'no-cache',
      },
    },
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
