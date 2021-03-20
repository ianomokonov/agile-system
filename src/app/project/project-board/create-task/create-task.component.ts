import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.less'],
})
export class CreateTaskComponent {
  public users: UserShortView[] = [];
  public editor = ClassicEditor;
  public createForm: FormGroup;
  constructor(private modal: NgbActiveModal, private fb: FormBuilder) {
    this.createForm = fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      projectUserId: [null, Validators.required],
    });
  }

  public dismiss() {
    this.modal.dismiss();
  }

  public close() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.modal.close(this.createForm.getRawValue());
  }
}
