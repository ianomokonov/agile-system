import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityBaseModel } from '../security-base-model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less'],
})
export class SignInComponent extends SecurityBaseModel {
  constructor(private fb: FormBuilder, private router: Router) {
    super(
      fb.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required],
      }),
    );
  }

  public onPrimaryBtnClick(): void {
    if (this.form.invalid) {
      this.markInvalidFields();
      this.errorText = this.getErrorText();
      return;
    }

    // const formValue = this.form.getRawValue();

    this.router.navigate(['/profile']);
  }
}
