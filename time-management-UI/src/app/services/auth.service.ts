import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly url: string = environment.apiURL
   readonly httpOptions: {} = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private readonly httpClient: HttpClient) { }

   login(email:string, password:string ) {
        return this.httpClient.post<User>(`${this.url}/login`, {email, password})
            // this is just the HTTP call, 
            // we still need to handle the reception of the token
            //.shareReplay();
    }
}
