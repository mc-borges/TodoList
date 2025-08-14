// src/app/shared/validators/custom-password.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const CustomPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value ?? '';

  if (value === '') return null;

  const hasNumber = /\d/.test(value);
  const hasSpecial = /[^A-Za-z0-9\s]/.test(value);

  return hasNumber && hasSpecial ? null : { invalidPassword: true };
};
