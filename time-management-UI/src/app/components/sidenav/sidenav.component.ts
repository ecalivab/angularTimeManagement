import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { menuList } from './menu-list';
import { UserStore } from 'src/app/store/user.store';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  menuItems = menuList;
  collapse = false;

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
    private readonly userStore: UserStore
    ) {}

    currentUser$: Observable<User> = this.userStore.user$;
    userLogged$:  Observable<boolean> = this.userStore.userLogged$;
}
