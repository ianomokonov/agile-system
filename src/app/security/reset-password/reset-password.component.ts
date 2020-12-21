import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SecurityBaseModel } from '../security-base-model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less'],
})
export class ResetPasswordComponent extends SecurityBaseModel {
  constructor(private fb: FormBuilder) {
    super(
      fb.group({
        email: [null, [Validators.required, Validators.email]],
      }),
    );
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
