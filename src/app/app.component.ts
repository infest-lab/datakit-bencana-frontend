import { OnInit, Component, OnChanges, ChangeDetectorRef } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { authConfig } from './auth/auth.config';
import { environment } from '../environments/environment';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
(window as any).global = window;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges{
	title = 'Gerbang Sulteng';
	apiUrl = environment.api.graphql;
	isLoggedIn:boolean;

	constructor(public authService: AuthService, private cd:ChangeDetectorRef) {			
		this.isLoggedIn = this.authService.isLoggedIn;
		//this.configureWithNewConfigApi();
	}
	/*constructor(private oauthService: OAuthService,  private cd:ChangeDetectorRef) {
	  this.configureWithNewConfigApi();
	}*/

	/*private configureWithNewConfigApi() {
	  this.oauthService.configure(authConfig);
	  this.oauthService.tokenValidationHandler = new JwksValidationHandler();
	  this.oauthService.loadDiscoveryDocumentAndTryLogin();
	  this.authService.oauthService = this.oauthService;
	}*/
	ngOnInit() {
		//console.log('login init:',this.isLoggedIn)
		this.authService.handleLoginCallback();
		this.isLoggedIn = this.authService.isLoggedIn;		
	}
	ngOnChanges(){
		this.cd.detectChanges();
	}
	login(){
		this.authService.login();
		this.isLoggedIn = this.authService.isLoggedIn;
		this.cd.markForCheck();
		//console.log('login login() :',this.isLoggedIn)
	}
	logout(){  	
		this.authService.logout();
		this.isLoggedIn=this.authService.isLoggedIn;
		this.cd.markForCheck();
		//console.log('login logout():',this.isLoggedIn)
	}
}
