import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserStore } from 'src/app/store/user.store';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  currentUser$: Observable<User> = new Observable<User>();
  userLogged$:  Observable<boolean> = this.userStore.userLogged$;
  currentUser: User = new User();

  constructor(
    private readonly userStore: UserStore,
    private readonly authService : AuthService
    ) { }

  ngOnInit(): void {
    // Get the current User in the local storage
    this.currentUser = this.authService.getCurrentUserLocalStore(); 
    if(!!this.currentUser.id){
      this.currentUser$ = this.authService.getUserById(this.currentUser.id);
    }
  }   
}
