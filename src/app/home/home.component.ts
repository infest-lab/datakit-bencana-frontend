import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { Promise } from 'bluebird';
import { Subject, Observable, Subscription } from 'rxjs';
import {map} from 'rxjs/operators';
import { _ } from 'underscore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
	sub:Subscription;
	statistik: any;
	loading: boolean = true;
	constructor(private appService:AppService) { }

	ngOnInit() {
		this.sub = this.appService.statistik().subscribe(({data}) => {
			this.statistik = data.statistik;
			this.loading = false;
		})
	}
	ngOnDestroy(){
		this.sub.unsubscribe();
	}

}
