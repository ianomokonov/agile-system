import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GetProfileInfoResponse } from 'back/src/models/responses/get-profile-info.response';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.less'],
})
export class EditUserComponent {
  public userForm: FormGroup;
  public set user(user: GetProfileInfoResponse) {
    this.userForm?.patchValue(user);
  }
  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private userService: UserService,
  ) {
    this.userForm = fb.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      vk: [null],
      gitHub: [null],
    });
  }

  public onFormSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const formValue = this.userForm.getRawValue();
    this.userService.editProfile(formValue).subscribe(() => {
      this.activeModal.close(formValue);
    });
  }

  public onCancelClick() {
    this.activeModal.dismiss();
  }
}
