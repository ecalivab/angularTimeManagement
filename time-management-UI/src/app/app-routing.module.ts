import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent} from './sidenav/sidenav.component'
import { LogInComponent } from './log-in/log-in.component'
import { RegistrationComponent } from './log-in/registration/registration.component';
const routes: Routes = [
  { path: '', component: SidenavComponent },
  { path: 'home', component: SidenavComponent },
  { path: 'log-in', component: LogInComponent},
  { path: 'register', component: RegistrationComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
