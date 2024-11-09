import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = "https://localhost:7049/"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { 
  }

  signup(signupRequest:any):Observable<any>{
    return this.http.post(BASE_URL+"api/User/register", signupRequest);
  }
  login(loginRequest:any):Observable<any>{
    return this.http.post(BASE_URL+"api/User/login", loginRequest);
  }
}
