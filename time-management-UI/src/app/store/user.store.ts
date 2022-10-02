import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { User } from '../models/user'

@Injectable({
  providedIn: 'root'
})

export abstract class UserStore {
    readonly user: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
    readonly userLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    readonly user$: Observable<User> = this.user.asObservable();
    readonly userLogged$: Observable<boolean> = this.userLogged.asObservable();

    updateUserLogged(value: boolean): void {
        this.userLogged.next(value);
    }

    updateUser(value: User) {
        this.user.next(value);
        this.updateUserLogged(true);
    }

}
