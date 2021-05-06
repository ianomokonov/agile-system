import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SecurityBaseModel } from '../security-base-model';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.less'],
})
export class UpdatePasswordComponent extends SecurityBaseModel {
  public token: string;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    super(
      fb.group({
        password: [null, [Validators.required]],
      }),
    );

    activatedRoute.queryParams.subscribe((params) => {
      this.token = params.token;
    });
  }

  public onPrimaryBtnClick(): void {
    if (this.form.invalid) {
      this.markInvalidFields();
      this.errorText = this.getErrorText();
      return;
    }

    const formValue = this.form.getRawValue();

    this.userService.updatePassword(this.token, formValue.password).subscribe(() => {
      this.router.navigate(['/profile']);
    });
  }
}
