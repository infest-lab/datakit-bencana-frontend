import { OnInit, Component, OnChanges, ChangeDetectorRef } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { authConfig } from './auth/auth.config';
import { environment } from '../environments/environment';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';

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
		/*this.authService.oauthInstance.tokenValidationHandler = new JwksValidationHandler();
	this.authService.oauthInstance.loadDiscoveryDocumentAndTryLogin();*/	
		this.isLoggedIn = this.authService.isLoggedIn;
	}
	/*constructor(private oauthService: OAuthService,  private cd:ChangeDetectorRef) {
	  this.configureWithNewConfigApi();
	}

	private configureWithNewConfigApi() {
	  this.oauthService.configure(authConfig);
	  this.oauthService.tokenValidationHandler = new JwksValidationHandler();
	  this.oauthService.loadDiscoveryDocumentAndTryLogin();
	}*/
	ngOnInit() {
		console.log('login init:',this.isLoggedIn)
		this.isLoggedIn = this.authService.isLoggedIn;
		let authResult = this.authService.getParamsObjectFromHash();
	    if(authResult) this.authService.getUserInfo(authResult);
	    else {
	      console.error(`Error: Auth Failed`);      
	    }
	}
	ngOnChanges(){
		this.cd.detectChanges();
	}
	login(){
		this.authService.login();
		this.isLoggedIn = this.authService.isLoggedIn;
		this.cd.markForCheck();
		console.log('login login() :',this.isLoggedIn)
	}
	logout(){  	
		this.authService.logout();
		this.isLoggedIn=this.authService.isLoggedIn;
		this.cd.markForCheck();
		console.log('login logout():',this.isLoggedIn)
	}
}
