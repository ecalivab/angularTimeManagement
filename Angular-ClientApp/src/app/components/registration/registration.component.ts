import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  form: FormGroup | any;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  ngOnInit(): void {
     this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName:  ['', Validators.required],
            email:     ['', [Validators.required, Validators.email,Validators.pattern(
              '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$',)]],
            password:  ['', [Validators.required, Validators.minLength(6)]]
        });
  }

  // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
      this.submitted = true;
      
      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.loading = true;
      this.authService.register(this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                this.router.navigate(['../home']);
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
    }
}
