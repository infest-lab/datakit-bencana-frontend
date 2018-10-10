import { OnInit, Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private authService: AuthService) {}
  ngOnInit() {
    /*if(this.authService.isLoggedIn){
      this.user = this.authService.getUserDetail();
      if(this.user.profile.sub.includes("google")){
        
        this.profilePicture = this.user.profile.picture;
        console.log('picture',this.profilePicture)
      }else{
        console.log('no picture')
      }
    }*/
  }
}
