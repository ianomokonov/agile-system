import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SecurityBaseModel } from '../security-base-model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less'],
})
export class ResetPasswordComponent extends SecurityBaseModel {
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
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

    this.userService.getUpdateLink(formValue.email).subscribe(
      () => {
        // eslint-disable-next-line no-alert
        alert('Вам на почту было отправлено сообщение для восстановления пароля');
        this.router.navigate(['/sign-in']);
      },
      () => {
        this.errorText = 'Пользователь с указанным email не найден';
      },
    );
  }
}
