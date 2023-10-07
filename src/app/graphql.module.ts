import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
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
