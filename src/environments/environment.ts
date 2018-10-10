// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth: {
    clientID: 'DlY6tIbs5TV22Dp755NwhKEnE3gMN2Ow',
    domain: 'gerbangsulteng.au.auth0.com',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile email'
  },
  api: {
  	graphql: 'http://localhost:9000/',
    socket: 'ws://localhost:9000/graphql',
  	key: 'jsdhjhsjhd76klluLu8rV1VmdzzD0Ba7So9KI5uKEH8Nksjdkjsd'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
