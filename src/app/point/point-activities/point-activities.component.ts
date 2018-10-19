import { QueryRef } from 'apollo-angular';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable, timer, Subscription } from 'rxjs';
import {map} from 'rxjs/operators';
import { _ } from 'underscore';
import * as moment from 'moment';
import {AuthService} from '../../auth/auth.service';
import {AppService} from '../../app.service';
import {pointActivities} from '../../graphql/query';
import {onActivityAdded} from '../../graphql/subscription';

@Component({
  selector: 'app-point-activities',
  templateUrl: './point-activities.component.html',
  styleUrls: ['./point-activities.component.css']
})
export class PointActivitiesComponent implements OnInit, OnDestroy {

	_pointId:any;
	loading:boolean = true;
	activitiesQuery: QueryRef<any>;
	activitiesObs: Observable<any>;
	activities: any;
	sub: Subscription;
	private _timer: any;

	@Input()
	set pointId(id: string) {
		this._pointId = id;		
		if(this.sub){
			this.loading = true;
			this.reloadActivities();
		}
	};

	constructor(private appService:AppService, private authService: AuthService, private cd: ChangeDetectorRef) {
		this.cd.detach();
		this._timer = setInterval(_ => {
			this.cd.detectChanges();
		}, 1000);
	}

	ngOnInit() {
		this.getActivities();
		this.sub = this.activitiesObs.subscribe( ({data}) => {
			this.activities = data.activities;
			this.loading = false;
			this.cd.markForCheck();
		})
		this.subscribeNewActivities();
	}
	getActivities(){
		//console.log('pointId:',this.pointId)
		this.activitiesQuery = this.appService.query({
	      query: pointActivities,
	      variables: {
	        pointId: this._pointId
	      }
	    });

	    this.activitiesObs = this.activitiesQuery.valueChanges; // async results
	}
	subscribeNewActivities(){
		this.activitiesQuery.subscribeToMore({
			document: onActivityAdded,
			updateQuery: (prev, {subscriptionData}) => {
				if (!subscriptionData.data) {
				  return prev;
				}

				const newItem = subscriptionData.data.activityAdded;
				return {
					activities: [newItem, ...prev.activities]				  
				}
			}
		})
	}
	reloadActivities(){
		this.getActivities();		
		this.sub = this.activitiesObs.subscribe( ({data}) => {
			this.loading = false;
			this.activities = data.activities;
			this.cd.markForCheck();			
		})
	}
	verifyActivity(id){
		if(!this.authService.isLoggedIn){
			if(confirm('Untuk memutakhirkan data, Anda diperlukan masuk/login terlebih dulu')){
				return this.authService.login();
			}
		}else{
			this.appService.verifyActivity(id, this.authService.getUserId()).subscribe(({data}) => {
				if(data.verifyActivity){
					console.log(data.verifyActivity)
					let _updated = _.findWhere(this.activities, { id: id });
					_updated.verified = data.verifyActivity.verified;
					_updated.verifiedBy = data.verifyActivity.verifiedBy;
					_.extend(_.findWhere(this.activities, { id: id }), _updated);
				}
				else alert('Verify Supply failed. Supply hanya dapat diverifikasi oleh pengguna lain.');
			});
		}				
	}
	ngOnDestroy(){
		this.sub.unsubscribe();
		clearInterval(this._timer);
	}
}
