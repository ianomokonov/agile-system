import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../models/user';

@Component({
  selector: 'app-create',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.less'],
})
export class EditUserComponent {
  public userForm: FormGroup;
  public set user(user: User) {
    this.userForm?.patchValue(user);
  }
  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) {
    this.userForm = fb.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
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
    this.activeModal.close(formValue);
  }

  public onCancelClick() {
    this.activeModal.dismiss();
  }
}
