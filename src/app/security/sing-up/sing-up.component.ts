import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SecurityBaseModel } from '../security-base-model';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.less'],
})
export class SingUpComponent extends SecurityBaseModel {
  constructor(private fb: FormBuilder) {
    super(
      fb.group({
        name: [null, Validators.required],
        surname: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required],
        passwordConfirm: [null, Validators.required],
      }),
    );

    this.form.setValidators(this.samePasswordsValidator());
  }

  public onPrimaryBtnClick(): void {
    if (this.form.invalid) {
      this.markInvalidFields();
      this.errorText = this.getErrorText();
      return;
    }

    const formValue = this.form.getRawValue();

    console.log(formValue);
  }
}
