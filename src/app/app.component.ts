import { OnInit, Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
	title = 'Gerbang Sulteng';
	collapsedMenu:boolean = true;
	apiUrl:any;
	constructor(public authService: AuthService, public deviceService: DeviceDetectorService) {			
		this.apiUrl = environment.api.graphql;
	}
	ngOnInit() {			
	}
	toggleMenu(){
		this.collapsedMenu = (this.collapsedMenu == false) ? true : false;
	}
	menuClass(){
		return (this.collapsedMenu) ? 'collapse navbar-collapse':'navbar-collapse';
	}
}