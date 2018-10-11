import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from './../../environments/environment';

export const authConfig: AuthConfig = {
	issuer: 'https://accounts.google.com',
	redirectUri: environment.auth.google.redirectUri,
	clientId: environment.auth.google.clientId,
	scope: 'openid profile email',
	strictDiscoveryDocumentValidation: false
}