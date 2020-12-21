import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export class SecurityBaseModel {
  public errorText = '';
  public form: FormGroup;
  public submitted = false;

  constructor(formGroup: FormGroup) {
    this.form = formGroup;
    this.form.valueChanges.subscribe(() => {
      this.errorText = this.getErrorText();
    });
  }

  public markInvalidFields(): void {
    if (!this.form) {
      return;
    }
    this.submitted = true;
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form?.controls[controlName];
      if (control?.invalid) {
        control.markAsDirty();
      }
    });
  }

  public samePasswordsValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [s: string]: boolean } | null => {
      const { value } = formGroup;
      if (value.password !== value.passwordConfirm) {
        return { differentPasswords: true };
      }

      return null;
    };
  }

  public getErrorText(): string {
    if (!this.submitted) {
      return '';
    }
    if (this.checkFields()) {
      return 'Не заполнены обязательные поля';
    }
    if (this.checkFields('email')) {
      return 'Введен некорректный email';
    }
    if (this.form.errors?.differentPasswords) {
      return 'Пароли не совпадают';
    }

    return '';
  }

  public checkFields(errorKeyToCheck = 'required'): boolean {
    return Object.keys(this.form.controls).some((key) =>
      Object.keys(this.form.controls[key].errors || {}).some(
        (errorKey) => errorKey === errorKeyToCheck,
      ),
    );
  }
}
