import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/services/storage/storage.service';
const BASE_URL = "https://taskmanagementapp20241111001602.azurewebsites.net/";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  

  getTask(isComplete:any, sortBy = 'createdDate', isDecs:any):Observable<any>{
    return this.http.get(BASE_URL+`api/Task`,{
      params: {
        IsCompleted: isComplete,
        SortBy: sortBy,
        IsDecsending: isDecs
      },
      headers: this.createAuthorizationHeader()
    })
  }

  getTaskById(id:any):Observable<any>{
    return this.http.get(BASE_URL+`api/Task/${id}`,{
      headers: this.createAuthorizationHeader()
    })
  }

  postFinishTask(id:any):Observable<any> {
    return this.http.post(BASE_URL+`api/Task/finish/${id}`, {} ,{
      headers: this.createAuthorizationHeader()
    })
  }

  postNewTask(formData:any):Observable<any>{
    return this.http.post(BASE_URL+`api/Task/create`, formData ,{
      headers: this.createAuthorizationHeader()
    })
  }

  putEditTask(id:any,formData:any):Observable<any>{
    return this.http.put(BASE_URL+`api/Task/update/${id}`, formData ,{
      headers: this.createAuthorizationHeader()
    })
  }

  deleteTask(id:any):Observable<any>{
    return this.http.delete(BASE_URL+`api/Task/delete/${id}`,{
      headers: this.createAuthorizationHeader(),
      responseType: 'text'
    })
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${StorageService.getToken()}`
    })
  }
}
