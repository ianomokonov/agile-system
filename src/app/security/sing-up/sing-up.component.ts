import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { SecurityBaseModel } from '../security-base-model';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.less'],
})
export class SingUpComponent extends SecurityBaseModel implements OnDestroy {
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
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

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public onPrimaryBtnClick(): void {
    if (this.form.invalid) {
      this.markInvalidFields();
      this.errorText = this.getErrorText();
      return;
    }
    const formValue = this.form.getRawValue();
    delete formValue.passwordConfirm;
    this.userService
      .signUp(formValue)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.router.navigate(['/profile']);
      });
  }
}
