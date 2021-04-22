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
    this.userForm?.patchValue({
      name: user.name,
      surname: user.surname,
      vk: user.vk,
      gitHub: user.gitHub,
      image: { file: null, path: user.image },
    });
  }
  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private userService: UserService,
  ) {
    this.userForm = fb.group({
      image: null,
      name: [null, Validators.required],
      surname: [null, Validators.required],
      vk: null,
      gitHub: null,
    });
  }

  public onFormSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const formValue = this.userForm.getRawValue();
    const formData = new FormData();
    formData.append('name', formValue.name);
    formData.append('surname', formValue.surname);
    formData.append('vk', formValue.vk);
    formData.append('gitHub', formValue.gitHub);
    if (formValue.image?.file || formValue.image?.path) {
      formData.append('image', formValue.image?.file || formValue.image?.path);
    }

    this.userService.editProfile(formData).subscribe(() => {
      this.activeModal.close(formValue);
    });
  }

  public onCancelClick() {
    this.activeModal.dismiss();
  }
}
