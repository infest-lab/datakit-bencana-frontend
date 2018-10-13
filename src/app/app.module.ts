import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { split } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { DateTimeFormatPipe } from './pipes/date-time-format.pipe';
import { FullDateTimeFormatPipe } from './pipes/full-date-time-format.pipe';
import { MatMenuModule, MatButtonModule } from '@angular/material';
import { NoopAnimationPlayer } from '@angular/animations';
import { OAuthModule, OAuthService, OAuthStorage, JwksValidationHandler } from "angular-oauth2-oidc";
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback.component';
import { ListPointsComponent } from './list-points/list-points.component';
import { PointComponent } from './point/point.component';
import { FormsComponent } from './forms/forms.component';
import { DemandComponent } from './forms/demand/demand.component';
import { SupplyComponent } from './forms/supply/supply.component';
import { ActivityComponent } from './forms/activity/activity.component';
import { DemographyComponent } from './forms/demography/demography.component';
import { PointDemandsComponent } from './point/point-demands/point-demands.component';
import { PointSuppliesComponent } from './point/point-supplies/point-supplies.component';
import { PointActivitiesComponent } from './point/point-activities/point-activities.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    DateTimeFormatPipe,
    FullDateTimeFormatPipe,
    HomeComponent,
    CallbackComponent,
    ListPointsComponent,
    PointComponent,
    FormsComponent,
    DemandComponent,
    SupplyComponent,
    ActivityComponent,
    DemographyComponent,
    PointDemandsComponent,
    PointSuppliesComponent,
    PointActivitiesComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpLinkModule,
    OAuthModule.forRoot(),
    AppRoutingModule,
    ApolloModule,
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule
  ],
  providers: [
    OAuthService,
  	AuthService,
  	AppService,
    { provide: OAuthStorage, useValue: sessionStorage }
  	/*{
    provide: APOLLO_OPTIONS,
	    useFactory(httpLink: HttpLink) {
	      return {
	        cache: new InMemoryCache(),
	        link: httpLink.create({
	          uri: environment.api.url
	        })
	      }
	    },
	    deps: [HttpLink]
	}*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
	constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    appService: AppService
  ) {
    // Create an http link:
    const http = httpLink.create({
      uri: environment.api.graphql
    });

    // Create a WebSocket link:
    const ws = new WebSocketLink({
      uri: environment.api.socket,
      options: {
        reconnect: true,
        timeout: 20000,
        connectionParams: appService.setHeaders()
      }
    });

    // using the ability to split links, you can send data to each link
    // depending on what kind of operation is being sent
    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      ws,
      http
    );

    apollo.create({
      link: link,
      cache: new InMemoryCache(),
    });
  }
}
