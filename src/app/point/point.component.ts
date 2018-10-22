import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject, Observable, timer, Subscription } from 'rxjs';
import { QueryRef } from 'apollo-angular';
import {map} from 'rxjs/operators';
import { _ } from 'underscore';
import * as moment from 'moment';
import {AuthService} from '../auth/auth.service';
import {AppService} from '../app.service';
import { point } from '../graphql/query';
import { onDemographyAdded } from '../graphql/subscription';
@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.css']
})
export class PointComponent implements OnInit, OnDestroy {

	private sub: Subscription;
	private timerSubscription: Subscription;
	private pointId: any;
	point: any;
	loading: boolean = true;
	displayForm: boolean = false;
	demandFormDisplay: boolean = false;
	supplyFormDisplay: boolean = false;
	activityFormDisplay: boolean = false;
	demographyFormDisplay: boolean = false;
	pointQuery: QueryRef<any>;
	pointObs: Observable<any>;

	constructor(private route: ActivatedRoute, private appService:AppService, private authService: AuthService, private deviceService: DeviceDetectorService) { }

	ngOnInit() {		
		this.route.params.subscribe(params => {
			this.pointId = params.id;
			this.getPoint();
			//this.getData();
			this.pointObs.subscribe( ({data}) => {
				this.point = data.point;
				this.loading = false;
			});
			this.subscribeNewDemography();
		});	
	}
	getData(){
		this.sub = this.appService.getPoint(this.pointId).subscribe( ({data}) => {
			this.point = data.point;
			this.loading = false;
		});
	}
	getPoint(){
		//console.log('pointId:',this.pointId)
		this.pointQuery = this.appService.query({
	      query: point,
	      variables: {
	        id: this.pointId
	      }
	    });

	    this.pointObs = this.pointQuery.valueChanges; // async results
	}
	subscribeNewDemography(){
		this.pointQuery.subscribeToMore({
			document: onDemographyAdded,
			updateQuery: (prev, {subscriptionData}) => {
				if (!subscriptionData.data) {
				  return prev;
				}

				const newItem = subscriptionData.data.demographyAdded;
				prev.point.lastDemography = newItem;
				return prev;
			}
		})
	}
	refresh($event){
		if($event == true) this.getData();
	}
	ngOnDestroy(){
		if (this.sub) {
	        this.sub.unsubscribe();
	    }
	    if (this.timerSubscription) {
	        this.timerSubscription.unsubscribe();
	    }
	}
	formatDate(date){
		return moment(date, "YYYYMMDD").fromNow();
	}
	demandForm($event){
		this.displayForm = $event;
		this.demandFormDisplay = $event;
	}
	supplyForm($event){
		this.displayForm = $event;
		this.supplyFormDisplay = $event;
	}
	activityForm($event){
		this.displayForm = $event;
		this.activityFormDisplay = $event;
	}
	demographyForm($event){
		this.displayForm = $event;
		this.demographyFormDisplay = $event;
	}
	hideForm(){
		this.demandForm(false);
		this.supplyForm(false);
		this.activityForm(false);
		this.demographyForm(false);
	}
	addDemand(){
		if(!this.authService.isLoggedIn){
			if(confirm('Untuk menambahkan data, Anda diperlukan masuk/login terlebih dulu')){
				return this.authService.login();
			}
		}else{
			this.hideForm();
			this.demandForm(true);
		}		
	}
	addSupply(){
		if(!this.authService.isLoggedIn){
			if(confirm('Untuk menambahkan data, Anda diperlukan masuk/login terlebih dulu')){
				return this.authService.login();
			}
		}else{
			this.hideForm();
			this.supplyForm(true);
		}
	}
	addActivity(){
		if(!this.authService.isLoggedIn){
			if(confirm('Untuk menambahkan data, Anda diperlukan masuk/login terlebih dulu')){
				return this.authService.login();
			}
		}else{
			this.hideForm();
			this.activityForm(true);
		}
	}
	updateDemography(){
		if(!this.authService.isLoggedIn){
			if(confirm('Untuk menambahkan data, Anda diperlukan masuk/login terlebih dulu')){
				return this.authService.login();
			}
		}else{
			this.hideForm();
			this.demographyForm(true);
		}		
	}

}
