import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,  private authService: AuthService, private message: MessageService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d).{8,}$')
      ]]
    });
  }

  get email(): AbstractControl {
    return this.loginForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.loginForm.get('password')!;
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Submitted', this.loginForm.value);
    }
  }



  login() {
      const {email, password} = this.loginForm.value;

      this.authService.getUserByEmail(email as string).subscribe(
        response => {
          if (response.length > 0 && response[0].password === password) {
            sessionStorage.setItem('email', email as string);
            this.router.navigate(['/home']);
          } else {
            console.error('User not found');
            this.message.add({ severity: 'error', summary: 'Error', detail: 'Invalid email or password' });
          }
        },
        error => {
          console.error('Error retrieving user:', error);
          this.message.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred' });
        }
      );
    
  }

}
