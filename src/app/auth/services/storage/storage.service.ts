import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

const TOKEN = "token";
const USER = "user";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  static saveToken (token : string): void{
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  static saveUser (user: any) : void{
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  static getToken(): string {
    if (typeof localStorage !== 'undefined'){
      return localStorage.getItem(TOKEN);
    }
    return '';
  }

  static isUserLoggedIn(): boolean {
    if(this.getToken() === null){
      return false;
    }
    return true;
  }

  static getUser(): any {
    return JSON.parse(localStorage.getItem(USER));
  }

  static getUserName(): string {
    const user = this.getUser();
    if(user == null)
      return "";
    return user.username;
  }

  static logout():void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }
}
