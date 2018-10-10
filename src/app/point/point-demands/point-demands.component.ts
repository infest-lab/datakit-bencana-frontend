import { QueryRef } from 'apollo-angular';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { Subject, Observable, timer, Subscription } from 'rxjs';
import { _ } from 'underscore';
import {AuthService} from '../../auth/auth.service';
import {AppService} from '../../app.service';
import {pointDemands} from '../../graphql/query';
import {onDemandAdded} from '../../graphql/subscription';

@Component({
  selector: 'app-point-demands',
  templateUrl: './point-demands.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./point-demands.component.css']
})
export class PointDemandsComponent implements OnInit, OnDestroy {
	_pointId:string;
	loading:boolean = true;
	demandsQuery: QueryRef<any>;
	demandsObs: Observable<any>;
	demands: any;
	sub: Subscription;
	private _timer: any;

	@Input()
	set pointId(id: string) {
		this._pointId = id;		
		if(this.sub){
			this.loading = true;
			this.reloadDemands();
		}
	};

	constructor(private appService:AppService, private authService: AuthService, private cd: ChangeDetectorRef) {
		this.cd.detach();
		this._timer = setInterval(_ => {
			this.cd.detectChanges();
		}, 1000);
	}

	ngOnInit() {
		this.getDemands();
		this.sub = this.demandsObs.subscribe( ({data}) => {
			this.loading = false;
			this.demands = data.demands;
			this.cd.markForCheck();
		})
		this.subscribeNewDemands();
	}
	getDemands(){
		this.demandsQuery = this.appService.query({
	      query: pointDemands,
	      variables: {
	        pointId: this._pointId
	      }
	    });

	    this.demandsObs = this.demandsQuery.valueChanges; // async results
	}
	subscribeNewDemands(){
		this.demandsQuery.subscribeToMore({
			document: onDemandAdded,
			updateQuery: (prev, {subscriptionData}) => {
				if (!subscriptionData.data) {
				  return prev;
				}

				const newItem = subscriptionData.data.demandAdded;
				return {
				  demands: [newItem, ...prev.demands]			  
				}
			}
		})
	}
	reloadDemands(){
		this.getDemands();		
		this.sub = this.demandsObs.subscribe( ({data}) => {
			this.loading = false;
			this.demands = data.demands;
			this.cd.markForCheck();			
		})
	}
	ngOnDestroy(){
		this.sub.unsubscribe();
		clearInterval(this._timer);
	}

}
