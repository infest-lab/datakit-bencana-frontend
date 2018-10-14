import { Injectable } from '@angular/core';
import * as auth0 from 'auth0-js';
import { Router } from '@angular/router';
(window as any).global = window;
import { Apollo } from 'apollo-angular';
import { ApolloClient, ApolloQueryResult } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { HttpHeaders } from '@angular/common/http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { Subject, Observable, Subscription } from 'rxjs';
import { map, take, debounceTime } from 'rxjs/operators';
import {} from 'jasmine';
import * as CryptoJS from 'crypto-js';
import {storageFactory} from "./../../libs/storageFactory";

import { environment } from './../../environments/environment';
import { getUser } from '../graphql/query';
import { createUser } from '../graphql/mutation';

@Injectable()
export class AuthService {
  //Machine to Machine
  // Create Auth0 web auth instance
  auth0 = new auth0.WebAuth({
    clientID: environment.auth.clientID,
    domain: environment.auth.domain,
    responseType: environment.auth.responseType,
    redirectUri: environment.auth.redirectUri,
    scope: environment.auth.scope
  });
  expiresAt: number;
  userProfile: any;
  accessToken: string;
  authenticated: boolean;
  userApi: any;
  private getUserApi: Subscription;
  public localStore = storageFactory(window.localStorage);

  constructor(private router: Router, private apollo:Apollo) {       
    this.getAccessToken();
  }
  login() {
    // Auth0 authorize request
    this.auth0.authorize();
  }
  handleLoginCallback() {
    
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash((err, authResult) => {
      console.log('authResult handleLoginCallback: ', authResult);
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        this.getUserInfo(authResult);
      } else if (err) {
        console.error(`Error: ${err.error}`);
      }
      this.router.navigate(['/home']);
    });

  }

  getAccessToken() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken) {
        this.getUserInfo(authResult);
      }
    });
  }

  getUserInfo(authResult) {
    // Use access token to retrieve user's profile and set session
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (profile) {        
        this._setSession(authResult, profile);
      }
    });    
  }

  private _setSession(authResult, profile) {
    // Save authentication data and update login status subject
    console.log('authResult:',authResult);
    console.log('userProfile:',profile);
    this.expiresAt = authResult.expiresIn * 1000 + Date.now();
    this.accessToken = authResult.accessToken;
    this.userProfile = profile;
    this.authenticated = true;
    this.findOrCreateUser();
    //Save to client local storage
    //this.localStore.setItem('access_token', authResult.access_token);
    this.localStore.setItem('expires_at', JSON.stringify(this.expiresAt));
    
  }

  logout() {
    // Log out of Auth0 session
    // Ensure that returnTo URL is specified in Auth0
    // Application settings for Allowed Logout URLs
    this.authenticated = false;
    this.localStore.removeItem('access_token');
    this.localStore.removeItem('expires_at');
    this.localStore.removeItem('userApi');
    
    this.auth0.logout({
      returnTo: environment.auth.redirectAfterLogoutUri,
      clientID: environment.auth.clientID
    });
  }

  get isLoggedIn(): boolean {
    // Check if current date is before token
    // expiration and user is signed in locally
    //return (Date.now() < this.expiresAt) && this.authenticated;
    if(this.expiresAt){
      //console.log(this.expiresAt)
      return (Date.now() < this.expiresAt) && this.authenticated;
    }else{
      let expiresAt = JSON.parse(this.localStore.getItem('expires_at') || '{}');
      //console.log(expiresAt)
      return new Date().getTime() < expiresAt;
    }
    
    //console.log('Date:',new Date().getTime());
    //console.log('Expires:',expiresAt)
    
  }

  findOrCreateUser(){
      //let api = new ApiService()
      let _apollo = this.apollo;
      let user = this.userProfile;
      let apikey = environment.api.key;
      let context = {
        headers: new HttpHeaders().set('x-datakit-api-key',`${apikey}`)
      }
      this.getUserApi =  _apollo.watchQuery<any>({
                query: getUser,
                variables: { email: user.email },
                context: context
            })
            .valueChanges
            .subscribe( ({data}) => {              
              if(data.getUser==null){
                //Tambah pengguna baru pada API melalui GraphQL Mutation
                return _apollo.mutate<any>({
                    mutation: createUser,
                    variables: {                       
                        input:{
                          name: user.name,
                          email: user.email,
                          profile: {
                            gender: user.gender,
                            nickname: user.nickname,
                            picture: user.picture,
                            sub: user.sub,
                            updated_at: user.updated_at
                          }
                        }                     
                    },
                    context: context
                })
               .subscribe( ({data}) => {           
                  if(data.createUser){
                    //console.log(data.createUser);
                    //localStorage.setItem('userApi', this.encrypt(data.createUser, true));
                    this.localStore.setItem('userApi', JSON.stringify(data.createUser));
                    this.userApi = data.createUser
                  }
                });
              }else{
                //console.log(data.getUser);
                //localStorage.setItem('userApi', this.encrypt(data.getUser, true));
                this.localStore.setItem('userApi',JSON.stringify(data.getUser));
                this.userApi = data.getUser;
              }
            });
  }
  getUserDetail(){
    let user = (this.userApi) ? this.userApi : JSON.parse(this.localStore.getItem('userApi'));
    
    return user;
  }
  getUserAvatar(){
    var user = this.getUserDetail();
    if(user && typeof user.profile.picture !== 'undefined') return user.profile.picture;
    return null;
  }
  public getUserName(){
    var user = this.getUserDetail();
    if(user && typeof user.name !== 'undefined') return user.name;
    return null;
  }
  getUserId(){
    var user = this.getUserDetail();
    if(user && typeof user.id !== 'undefined') return user.id
    return null;
  }
  getUserToken(){
    return (this.accessToken) ? this.accessToken : this.localStore.getItem('access_token');
  }

  encrypt(thing, isObject = false){
    if(isObject) return CryptoJS.AES.encrypt(JSON.stringify(thing), environment.auth.clientID).toString();
    return CryptoJS.AES.encrypt(thing, environment.auth.clientID).toString();
  }
  decrypt(thing, isObject = false){
    var bytes  = CryptoJS.AES.decrypt(thing, environment.auth.clientID);
    if(isObject) return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
