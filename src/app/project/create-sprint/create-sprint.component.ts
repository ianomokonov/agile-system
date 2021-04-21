import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-sprint',
  templateUrl: './create-sprint.component.html',
  styleUrls: ['./create-sprint.component.less'],
})
export class CreateSprintComponent {
  public sprintForm: FormGroup;
  constructor(private fb: FormBuilder, private modal: NgbActiveModal) {
    this.sprintForm = fb.group({
      name: [null, Validators.required],
      goal: [null, Validators.required],
    });
  }

  public dismiss() {
    this.modal.dismiss();
  }

  public close() {
    if (this.sprintForm.invalid) {
      this.sprintForm.markAllAsTouched();
      return;
    }

    this.modal.close(this.sprintForm.getRawValue());
  }
}
