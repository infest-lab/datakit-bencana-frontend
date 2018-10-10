import { Injectable } from '@angular/core';
import * as auth0 from 'auth0-js';
import { Router } from '@angular/router';
(window as any).global = window;
import { Apollo } from 'apollo-angular';
import { ApolloClient, ApolloQueryResult } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { HttpHeaders } from '@angular/common/http';
//import { HttpClient } from '@angular/common/http';
//import { HttpLink } from 'apollo-angular-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { Subject, Observable, Subscription } from 'rxjs';
import { map, take, debounceTime } from 'rxjs/operators';
import {} from 'jasmine';
import * as CryptoJS from 'crypto-js';

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
  // Store authentication data
  expiresAt: number;
  userProfile: any;
  accessToken: string;
  authenticated: boolean;
  //private apollo: Apollo;  
  private getUserApi: Subscription;
  userApi: any;
  //apiService: ApiService;

  constructor(private router: Router, private apollo:Apollo) {       
    this.getAccessToken();   
  }

  login() {
    // Auth0 authorize request
    this.auth0.authorize();
  }

  handleLoginCallback() {
    console.log('handleLoginCallback')
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash((err, authResult) => {
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
    this.expiresAt = authResult.expiresIn * 1000 + Date.now();
    this.accessToken = authResult.accessToken;
    this.userProfile = profile;
    this.authenticated = true;
    this.findOrCreateUser();
    //console.log('userApi:',this.userApi);
    //localStorage.setItem('access_token', this.encrypt(authResult.accessToken, false));
    //localStorage.setItem('profile', this.encrypt(profile, true));
    localStorage.setItem('access_token', authResult.accessToken);
    //localStorage.setItem('profile', profile);
    localStorage.setItem('expires_at', this.expiresAt.toString());
  }

  logout() {
    // Log out of Auth0 session
    // Ensure that returnTo URL is specified in Auth0
    // Application settings for Allowed Logout URLs
    localStorage.removeItem('access_token');
    //localStorage.removeItem('profile');
    localStorage.removeItem('userApi');
    localStorage.removeItem('expires_at');
    this.auth0.logout({
      returnTo: 'http://localhost:4200',
      clientID: environment.auth.clientID
    });
  }

  get isLoggedIn(): boolean {
    // Check if current date is before token
    // expiration and user is signed in locally
    //return (Date.now() < this.expiresAt) && this.authenticated;
    let expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    //console.log('Date:',new Date().getTime());
    //console.log('Expires:',expiresAt)
    return new Date().getTime() < expiresAt;
  }

  findOrCreateUser(){
      //let api = new ApiService()
      let _apollo = this.apollo;
      let user = this.userProfile;
      this.getUserApi =  _apollo.watchQuery<any>({
                query: getUser,
                variables: { email: user.email }
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
                    }
                })
               .subscribe( ({data}) => {           
                  if(data.createUser){
                    console.log(data.createUser);
                    //localStorage.setItem('userApi', this.encrypt(data.createUser, true));
                    localStorage.setItem('userApi', JSON.stringify(data.createUser));
                    this.userApi = data.createUser
                  }
                });
              }else{
                console.log(data.getUser);
                //localStorage.setItem('userApi', this.encrypt(data.getUser, true));
                localStorage.setItem('userApi',JSON.stringify(data.getUser));
                this.userApi = data.getUser;
              }
            });
  }
  getUserDetail(){
    var user = {
      //profile: this.decrypt(localStorage.getItem('profile'), true),
      //userApi: this.decrypt(localStorage.getItem('userApi'), true)
      //profile: localStorage.getItem('userProfile'),
      userApi: JSON.parse(localStorage.getItem('userApi'))
    }
    return user;
  }
  getUserAvatar(){
    var user = this.getUserDetail();
    if(user) return user.userApi.profile.picture;
    return null;
  }
  getUserName(){
    var user = this.getUserDetail();
    if(user) return user.userApi.name;
    return null;
  }
  getUserId(){
    var user = this.getUserDetail();
    if(user) return user.userApi.id
    return null;
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
