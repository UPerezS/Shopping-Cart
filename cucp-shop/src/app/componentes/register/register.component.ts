import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { User } from '../../interfaces/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private message: MessageService, private router: Router) {
    this.registerForm = this.fb.group({
      fullname: ['', Validators.required],
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d).{8,}$')
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  get fullname(): AbstractControl {
    return this.registerForm.get('fullname')!;
  }

  get usuario(): AbstractControl {
    return this.registerForm.get('usuario')!;
  }

  get email(): AbstractControl {
    return this.registerForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.registerForm.get('password')!;
  }

  get confirmPassword(): AbstractControl {
    return this.registerForm.get('confirmPassword')!;
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

  }

  enviarRegistro() {
    console.log('Form Submitted', this.registerForm.value);

    const data = { ...this.registerForm.value };
    delete data.confirmPassword;

    this.authService.registerUser(data as User).subscribe(
      response => {
        console.log('User registered successfully:', response);
        this.message.add({ severity: 'success', summary: 'Success', detail: 'Registration Aggregate' });
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error registering user:', error);
        this.message.add({ severity: 'error', summary: 'Error', detail: 'Registration failed' });
      }
    );
  }

}
