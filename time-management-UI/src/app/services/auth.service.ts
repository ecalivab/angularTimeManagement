import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { UserStore } from '../store/user.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly url: string = environment.apiURL
  readonly httpOptions: {} = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' })
  }

  constructor(
    private readonly httpClient: HttpClient,
    private readonly userStore: UserStore,
    private router: Router) 
  { }
  
  //* We are calling *shareReplay* to prevent the receiver of this Observable from accidentally triggering multiple POST requests due to multiple subscriptions.
  login(email:string, password:string ): void {
    this.httpClient.post<User>(`${this.url}/Auth/login`, {email, password}).pipe(
       catchError(this.handleError), shareReplay()
      ).subscribe(
         data => {
            this.userStore.updateUser(data);
            localStorage.setItem('user', JSON.stringify(data))
          }
      )
  }

  getCurrentUserLocalStore(): User {
    let currentUser: User = JSON.parse(localStorage.getItem('user')!); // with ! at the end of getitem inside the JSON.parse(!) I am saying that I know the value cannot be null
    return currentUser
  }

  logout(): void {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userStore.logoutUser()
    this.router.navigate(['/home']);
  }

  register(user: User): Observable<any> {
   return this.httpClient.post(`${this.url}/Auth/register`, user).pipe(catchError(this.handleError))
  }

  getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/Auth/get/${id}`)
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

