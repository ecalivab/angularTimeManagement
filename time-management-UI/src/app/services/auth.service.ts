import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { UserStore } from '../store/user.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly url: string = environment.apiURL
   readonly httpOptions: {} = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(
    private readonly httpClient: HttpClient,
    private readonly userStore: UserStore,) 
  { }

  login(email:string, password:string ): void {
    this.httpClient.post<any>(`${this.url}/Auth/login`, {email, password}).pipe(
        catchError(this.handleError)
      ).subscribe(
        data => this.userStore.updateUser(data)
      );
  }

  register(user: User): Observable<any> {
   return this.httpClient.post(`${this.url}/Auth/register`, user).pipe(catchError(this.handleError))
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => msg);
  }
}
