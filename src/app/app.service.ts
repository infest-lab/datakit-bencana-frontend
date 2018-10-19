import { Promise } from 'bluebird';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Subject, Observable, Subscription } from 'rxjs';
import { map, take, debounceTime } from 'rxjs/operators';
(window as any).global = window;
import {} from 'jasmine';
import { environment } from '../environments/environment';
import { AuthService } from './auth/auth.service';
import {
	listPoints,
	point,
	pointDemands,
	pointSupplies,
	pointActivities,
	statistik,
	pointCategory,
	pointsByCategory
} from './graphql/query';
import {
	addDemand,
	addActivity,
	addDemography,
	addSupply,
	verifyDemand,
	closeDemand,
	verifySupply,
	verifyActivity,
	verifyDemography
} from './graphql/mutation';
import {
	onDemandAdded,
	onActivityAdded,
	onSupplyAdded
} from './graphql/subscription';
@Injectable()
export class AppService{
	constructor(private authService:AuthService, private apollo:Apollo) {}
	getApollo(){
		return this.apollo;
	}
	query(args){		
		return this.apollo.watchQuery<any>(this.mergeContext(args));
	}
	mutation(args){
		return this.apollo.mutate<any>(this.mergeContext(args));
	}
	mergeContext(args){		
		if(typeof args.query !== undefined || typeof args.mutation !== undefined){
			//console.log('subscription',args);
			let apikey = environment.api.key;
			let token = this.authService.getUserToken();
			if (!this.authService.isLoggedIn) {			
				args.context = {
		      		headers: new HttpHeaders().set('x-datakit-api-key',`${apikey}`)     		
		      	};
		    	return args;
		    } else {
		      	args.context = {
		      		headers: new HttpHeaders().set('authorization',`Bearer ${token}`).set('x-datakit-api-key',`${apikey}`)	      		
		      	};
		       	return  args;
		    }
		}
		return args;		
	}
	setHeaders(){
		let apikey = environment.api.key;
		let token = this.authService.getUserToken();
		let headers:any;
		if (!this.authService.isLoggedIn) {
			headers = {
				'x-datakit-api-key': apikey
			};
			//headers = new HttpHeaders().set('X-API-KEY',`${apikey}`);	
	    } else {
	    	headers = {
				'x-datakit-api-key': apikey,
				'authorization': `Bearer ${token}`
			};
	      	//headers = new HttpHeaders().set('Authorization',`Bearer ${token}`).set('X-API-KEY',`${apikey}`);
	    }
	    return  headers;
	}

	/*==============================================================
	* 		List of Queries and Mutations
	* ==============================================================*/
	
	// Points
	listPoints(){
		return this.query({
            query: listPoints,
            variables: { limit: 300, skip: 0 }
        })
        .valueChanges
	}
	getPoint(id){
		return this.query({
            query: point,
            variables: { id: id }
        })
        .valueChanges
	}
	pointCategory(){
		return this.query({
            query: pointCategory
        })
        .valueChanges
	}
	pointsByCategory(category){
		return this.query({
            query: pointsByCategory,
            variables: {
            	category: category
            }
        })
        .valueChanges
	}
	//Demands
	addDemand(input){
		return this.mutation({
			mutation: addDemand,
			variables: {input: input}
		});
	}
	verifyDemand(id, user){
		return this.mutation({
			mutation: verifyDemand,
			variables: {id: id, user:user}
		});
	}
	closeDemand(id, user){
		return this.mutation({
			mutation: closeDemand,
			variables: {id: id, user:user}
		});
	}
	addSupply(input){
		return this.mutation({
			mutation: addSupply,
			variables: {input: input}
		});
	}
	verifySupply(id, user){
		return this.mutation({
			mutation: verifySupply,
			variables: {id: id, user:user}
		});
	}
	addActivity(input){
		return this.mutation({
			mutation: addActivity,
			variables: {input: input}
		});
	}
	verifyActivity(id, user){
		return this.mutation({
			mutation: verifyActivity,
			variables: {id: id, user:user}
		});
	}
	addDemography(input){
		return this.mutation({
			mutation: addDemography,
			variables: {input: input}
		});
	}
	verifyDemography(id, user){
		return this.mutation({
			mutation: verifyDemography,
			variables: {id: id, user:user}
		});
	}
	pointDemands(pointId){
		return this.query({
			query: pointDemands,
			variables: { pointId: pointId }
		})
		.valueChanges
	}
	pointSupplies(pointId){
		return this.query({
			query: pointSupplies,
			variables: { pointId: pointId }
		})
		.valueChanges
	}
	pointActivities(pointId){
		return this.query({
			query: pointActivities,
			variables: { pointId: pointId }
		})
		.valueChanges
	}
	statistik(){
		return this.query({
			query: statistik
		})
		.valueChanges
	}
}