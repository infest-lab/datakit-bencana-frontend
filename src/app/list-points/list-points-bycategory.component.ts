import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../app.service';
import { Promise } from 'bluebird';
import { Subject, Observable, Subscription } from 'rxjs';
import {map} from 'rxjs/operators';
import { _ } from 'underscore';

@Component({
  selector: 'app-list-points-bycategory',
  templateUrl: './list-points-bycategory.component.html',
  styleUrls: ['./list-points.component.css']
})
export class ListPointsByCategoryComponent implements OnInit, OnDestroy {

	private sub: Subscription;
	@Input()
	category: any;
	@Input()
	partial: boolean=false;

  	points: any;
	private originPoints: any;
	querySearch: string;
	loading:boolean=true;

	constructor(private route: ActivatedRoute, private appService:AppService) { }

	ngOnInit() {
		if(this.category != null){
			this.sub = this.appService.pointsByCategory(this.category).subscribe(({data}) => {
				this.originPoints = data.pointsByCategory;
				this.points = data.pointsByCategory;
				this.loading = false;
			});
		}else{
			this.route.params.subscribe(params => {
				this.category = params.category
				this.sub = this.appService.pointsByCategory(params.category).subscribe(({data}) => {
					this.originPoints = data.pointsByCategory;
					this.points = data.pointsByCategory;
					this.loading = false;
				});
			});	
		}			
	}
	size(obj){
		return _.size(obj);
	}
	searchPoint(value:string){
		this.querySearch = value;
		//console.log(this.doSearchPoint(value));
		this.points = this.doSearchPoint(value);
	}
	doSearchPoint(value:string){
		if(value == ''){ 
			return this.originPoints;
		}
		else{
			return _.filter(this.originPoints, function(point){ 
				return point.name.toLowerCase().indexOf(value.toLowerCase()) != -1;
			});
		}
	}
	ngOnDestroy(){
		this.sub.unsubscribe();
	}

}
