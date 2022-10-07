import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { User } from '../models/user'

@Injectable({
  providedIn: 'root'
})

export abstract class UserStore {
    private readonly _user: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
    private readonly _userLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    readonly user$: Observable<User> = this._user.asObservable();
    readonly userLogged$: Observable<boolean> = this._userLogged.asObservable();

    updateUserLogged(value: boolean): void {
        this._userLogged.next(value);
    }

    updateUser(value: User): void {
        this._user.next(value);
        this.updateUserLogged(true);
    }

    logoutUser(): void {
        this._user.next(new User());
        this._userLogged.next(false);
    }
}
