export const environment = {
  production: false,
  auth: {
    clientID: '',
    domain: '',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile email'
  },
  api: {
  	graphql: 'http://...',
    socket: 'ws://...',
  	key: ''
  }
};