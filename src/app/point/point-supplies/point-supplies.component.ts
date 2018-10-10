import { QueryRef } from 'apollo-angular';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { Subject, Observable, timer, Subscription } from 'rxjs';
import { _ } from 'underscore';
import {AuthService} from '../../auth/auth.service';
import {AppService} from '../../app.service';
import {pointSupplies} from '../../graphql/query';
import {onSupplyAdded} from '../../graphql/subscription';

@Component({
  selector: 'app-point-supplies',
  templateUrl: './point-supplies.component.html',
  styleUrls: ['./point-supplies.component.css']
})
export class PointSuppliesComponent implements OnInit, OnDestroy {

	_pointId:any;
	loading:boolean = true;
	suppliesQuery: QueryRef<any>;
	suppliesObs: Observable<any>;
	supplies: any;
	sub: Subscription;
	private _timer: any;

	@Input()
	set pointId(id: string) {
		this._pointId = id;		
		if(this.sub){
			this.loading = true;
			this.reloadSupplies();
		}
	};
	constructor(private appService:AppService, private authService: AuthService, private cd: ChangeDetectorRef) {
		this.cd.detach();
		this._timer = setInterval(_ => {
			this.cd.detectChanges();
		}, 1000);
	}

	ngOnInit() {
		this.getSupplies();
		this.sub = this.suppliesObs.subscribe( ({data}) => {
			this.supplies = data.supplies;
			this.loading = false;
			this.cd.markForCheck();
		})
		this.subscribeNewSupplies();
	}
	getSupplies(){
		//console.log('pointId:',this.pointId)
		this.suppliesQuery = this.appService.query({
	      query: pointSupplies,
	      variables: {
	        pointId: this._pointId
	      }
	    });

	    this.suppliesObs = this.suppliesQuery.valueChanges; // async results
	}
	subscribeNewSupplies(){
		this.suppliesQuery.subscribeToMore({
			document: onSupplyAdded,
			updateQuery: (prev, {subscriptionData}) => {
				if (!subscriptionData.data) {
				  return prev;
				}

				const newItem = subscriptionData.data.supplyAdded;
				return {
				  supplies: [newItem, ...prev.supplies]		  
				}
			}
		})
	}
	reloadSupplies(){
		this.getSupplies();		
		this.sub = this.suppliesObs.subscribe( ({data}) => {
			this.loading = false;
			this.supplies = data.supplies;
			this.cd.markForCheck();			
		})
	}
	ngOnDestroy(){
		this.sub.unsubscribe();
		clearInterval(this._timer);
	}
}
