import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { Promise } from 'bluebird';
import { Subject, Observable, Subscription } from 'rxjs';
import {map} from 'rxjs/operators';
import { _ } from 'underscore';

@Component({
  selector: 'app-list-points',
  templateUrl: './list-points.component.html',
  styleUrls: ['./list-points.component.css']
})
export class ListPointsComponent implements OnInit, OnDestroy {

	private sub: Subscription;
  	points: any;
	private originPoints: any;
	querySearch: string;

	constructor(private appService:AppService) { }

	ngOnInit() {
		this.sub = this.appService.listPoints().subscribe(({data}) => {
			this.originPoints = data.points;
			this.points = _.groupBy(data.points, function(num){
				return num.category;
			});
			//console.log(this.points);
		});
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
		if(value == '') return _.groupBy(this.originPoints, function(num){return num.category});
		else{
			var points = _.groupBy(_.filter(this.originPoints, function(point){ 
				return point.name.toLowerCase().indexOf(value.toLowerCase()) != -1;
			}), function(item){
				return item.category;
			});

			return points;
		}
	}
	ngOnDestroy(){
		this.sub.unsubscribe();
	}

}
