import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-point-category',
  templateUrl: './point-category.component.html',
  styleUrls: ['./point-category.component.css']
})
export class PointCategoryComponent implements OnInit, OnDestroy {

	categories:any;
	sub:any;
	loading:boolean=true;

	constructor(private appService:AppService) { }

	ngOnInit() {
		this.sub = this.appService.pointCategory().subscribe( ({data}) => {
			console.log(data)
			this.categories = data.pointCategory;
			this.loading = false;
		});
	}
	ngOnDestroy(){
		this.sub.unsubscribe();
	}

}
