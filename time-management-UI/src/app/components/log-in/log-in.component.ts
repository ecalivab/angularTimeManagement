import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserStore } from 'src/app/store/user.store';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  form: FormGroup | any;
  loading = false;
  submitted = false;
  constructor( 
    private formBuilder: FormBuilder,
    private readonly userStore: UserStore,
    private authService: AuthService) { }

  currentUser$: Observable<User> = this.userStore.user$;
  userLogged$:  Observable<boolean> = this.userStore.userLogged$;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
            email:  ['', [Validators.required, Validators.email,Validators.pattern(
              '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$',)]],
            password: ['', Validators.required]
        });
  }

  // convenience getter for easy access to form fields (this.f.username.value, this.f.password.value)
  get f() { return this.form.controls; }

  onSubmit() {
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.authService.login(this.f.email.value, this.f.password.value)
        this.form.reset();
    }
  
  logOut() {
     this.authService.logout()
  }
}
