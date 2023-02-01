import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { UserStore } from '../store/user.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  constructor(
    private readonly httpClient: HttpClient,
    private readonly userStore: UserStore,
    private router: Router) 
  { }

  readonly user$: Observable<User> = this.userStore.user$;
  readonly userLogged$: Observable<boolean> = this.userStore.userLogged$;
  readonly url: string = environment.apiURL
  readonly httpOptions: {} = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Methods':'GET,POST,PATCH,DELETE,PUT,OPTIONS' })
  }


  // ------------------- HTTP CALLS ------------------------------
  
  //* We are calling *shareReplay* to prevent the receiver of this Observable from accidentally triggering multiple POST requests due to multiple subscriptions.
  login(email:string, password:string ): void {
    this.httpClient.post<User>(`${this.url}/Auth/login`, {email, password}, this.httpOptions).pipe(
       catchError(this.handleError), shareReplay()
      ).subscribe(
         data => {
            this.userStore.updateUser(data);
            localStorage.setItem('user', JSON.stringify(data))
            this.router.navigate(['']);
          }
      )
  }
 
  register = (user: User): Observable<any> => {
   return this.httpClient.post(`${this.url}/Auth/register`, user, this.httpOptions).pipe(catchError(this.handleError))
  }

 //-------------------END HTTP CALLS--------------------------------


  logout = (): void => {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userStore.logoutUser()
    this.router.navigate(['/home']);
  }

  getCurrentUserLocalStore = (): User => {
    let currentUser: User = JSON.parse(localStorage.getItem('user')!); // with ! at the end of getitem inside the JSON.parse(!) I am saying that I know the value cannot be null
    return currentUser
  }
  
  isUserLogged = (): boolean => {
    let logged: boolean =  false;
    let localUser: boolean = !!this.getCurrentUserLocalStore() ? true: false
    this.userLogged$.subscribe(val => 
      logged = val
    )

    return logged || localUser;
  }

  getUserById = (id: string): Observable<User> => {
    return this.httpClient.get<User>(`${this.url}/Auth/get/${id}`)
  }

  updateUser = (user: User) : void => {
    this.userStore.updateUser(user);
  }
  
  // Error
  handleError = (error: HttpErrorResponse) => {
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

