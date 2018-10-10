import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {
	
	constructor() { }

	ngOnInit() {
	}

}
