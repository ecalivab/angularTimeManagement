import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { menuList } from './menu-list';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  menuItems = menuList;
  collapse: boolean = false;

  currentUser$: Observable<User> = this.authService.user$;
  userLogged$:  Observable<boolean> = this.authService.userLogged$;

  // If user is not logged the route should be home otherwise it is "enabled"
  userProfileRoute: string = 'home';
  // Variable use to get information from the LocalStorage so it will be persist after refres (F5)
  currentUser: User | null = null;

  toggleSidenav(){
    this.collapse = !this.collapse;
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
      //* If User is in local storage, update the observable with the user values.
      this.currentUser = this.authService.getCurrentUserLocalStore();
      if(this.currentUser !== null) 
      {
        this.authService.updateUser(this.currentUser);
      }
      this.userLogged$.subscribe(val => this.userProfileRoute = val ? "user-profile" : "home");     
    }
   
}
