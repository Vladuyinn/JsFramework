import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

  export function strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[#?!@$%^&*-]/.test(value);
      const isLongEnough = value.length >= 8;

      const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isLongEnough;

      return passwordValid ? null : {
        strongPassword: {
          hasNumber,
          hasUpper,
          hasLower,
          hasSpecial,
          isLongEnough
        }
      };
    };
  }
