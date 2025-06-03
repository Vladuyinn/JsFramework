import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { strongPasswordValidator } from '../../../core/validators/strong-password';
import { passwordMatchValidator } from '../../../core/validators/password-match';
import { CreateUserDto } from '../../../core/models/user';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-register-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly acceptTerms = new FormControl(false, [Validators.requiredTrue]);
  registerForm: FormGroup = this.createForm();
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  private createForm(): FormGroup {
    return this.fb.group(
      {
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          strongPasswordValidator(),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validators: passwordMatchValidator('password', 'confirmPassword'),
      }
    );
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;

      const formValue = this.registerForm.value;
      const userData: CreateUserDto = {
        email: formValue.email,
        password: formValue.password,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
      };

      try {
        this.authService.register(userData);
        this.snackBar.open('Inscription réussie', 'Fermer', {
          duration: 5000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['']);
      } catch (error) {
        this.isLoading = false;
        this.snackBar.open(
          error instanceof Error
            ? error.message
            : "Erreur lors de l'inscription",
          'Fermer',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        );
      }
    }
  }

  // Getters pour les erreurs
  get firstNameErrors() {
    const control = this.registerForm.get('firstName');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Le prénom est requis';
      if (control.errors['minlength'])
        return 'Le prénom doit contenir au moins 2 caractères';
    }
    return null;
  }

  get lastNameErrors() {
    const control = this.registerForm.get('lastName');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Le nom est requis';
      if (control.errors['minlength'])
        return 'Le nom doit contenir au moins 2 caractères';
    }
    return null;
  }

  get emailErrors() {
    const control = this.registerForm.get('email');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return "L'email est requis";
      if (control.errors['email']) return "Format d'email invalide";
      if (control.errors['emailExists']) return 'Cet email est déjà utilisé';
    }
    return null;
  }

  get passwordErrors() {
    const control = this.registerForm.get('password');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Le mot de passe est requis';
      if (control.errors['strongPassword']) {
        const errors = control.errors['strongPassword'];
        const messages = [];
        if (!errors.isLongEnough) messages.push('8 caractères minimum');
        if (!errors.hasUpper) messages.push('une majuscule');
        if (!errors.hasLower) messages.push('une minuscule');
        if (!errors.hasNumber) messages.push('un chiffre');
        if (!errors.hasSpecial) messages.push('un caractère spécial');
        return `Le mot de passe doit contenir : ${messages.join(', ')}`;
      }
    }
    return null;
  }

  get confirmPasswordErrors() {
    const control = this.registerForm.get('confirmPassword');

    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'La confirmation est requise';
    }
    if (this.registerForm.errors?.['passwordMismatch'] && control?.touched) {
      return 'Les mots de passe ne correspondent pas';
    }
    return null;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
