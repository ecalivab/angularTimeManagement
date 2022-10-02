import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent} from './components/sidenav/sidenav.component'
import { LogInComponent } from './components/log-in/log-in.component'
import { RegistrationComponent } from './components/registration/registration.component';
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
