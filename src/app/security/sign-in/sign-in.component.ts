import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { SecurityBaseModel } from '../security-base-model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less'],
})
export class SignInComponent extends SecurityBaseModel implements OnDestroy {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
  ) {
    super(
      fb.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required],
      }),
    );

    if (tokenService.getRefreshToken()) {
      this.router.navigate(['/profile']);
    }
  }

  public ngOnDestroy() {
    this.rxAlive = false;
  }

  public onPrimaryBtnClick(): void {
    if (this.form.invalid) {
      this.markInvalidFields();
      this.errorText = this.getErrorText();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.userService
      .login(email, password)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(
        () => {
          this.router.navigate(['/profile']);
        },
        () => {
          this.errorText = 'Пользователь с указанными данными не найден';
        },
      );
  }
}
