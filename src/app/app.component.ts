import { OnInit, Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
	title = 'Gerbang Sulteng';
	
	constructor(public authService: AuthService) {			
		
	}
	ngOnInit() {			
	}
}
