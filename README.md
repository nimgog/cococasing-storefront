# Coco Casing Storefront

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Development

### VS Code extensions

It is strongly encouraged to install the extensions recommended by VS Code.

The extensions will make sure that:

- Code formatting and linting rules are applied consistently
- Language server guides the development, i.e. Angular and Apollo GraphQL syntax highlighting, auto-completion, etc.

### Environment variables

For development, set the `turnstileSiteKey` environment variable to any one of the test sitekeys from the [Testing](https://developers.cloudflare.com/turnstile/reference/testing) page of Turnstile docs.

### GraphQL schema fetching and type generation

Run `npm run gql:fetch` to (re)fetch Shopify Storefront's GraphQL schema.
This is only required if the schema is not there yet or there has been a change in the Storefront API version.
Executing the command from time to time helps in identifying potential schema changes.

The fetched content is placed into the `codegen/shopify-schema.json` file.

Run `npm run gql:generate` to update the GraphQL types whenever:

- The Storefront GraphQL API's version is updated or changes in the current version are identified
- A GraphQL file (fragment/query/mutation/subscription with `.gql` extension) is added or updated under the `src/app/graphql` directory

The `src/app/graphql/types/index.ts` file's content, updated by the generation, should be committed.

Alternatively, run `npm run gql:watch` to watch changes in the graphql files' folder and have the TypeScript types automatically regenerated when an update happens.

### Static Site Generation and asset serving with Scully

Run `npm run build` to build the project.
The build artifacts will be stored in the `dist/cococasing-storefront` directory.

Run `npm run scully` to initiate static site rendering.
The build artifacts will be stored in the `dist/static` directory.

In a new terminal, run `npm scully:serve` to run the Scully static server. This is needed for getting the content for the blog posts.

Alternatively, run `npm run blog:serve` to watch changes in the blog folder's Markdown files and have the static pages regenerated when a post is added or updated.

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`.
The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component.

You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

``` bash
npm run gql:fetch
npm run gql:generate
npm run build
npm run scully
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

