import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private router: Router,
  ) { }

  ngOnInit(): void {
     this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName:  ['', Validators.required],
            email:     ['', Validators.required],
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
        this.router.navigate(['/log-in'])
       
    }

}
