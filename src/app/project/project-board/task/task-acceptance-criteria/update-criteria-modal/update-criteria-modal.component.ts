import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { editorConfig } from 'src/app/utils/constants';

@Component({
  selector: 'app-update-criteria-modal',
  templateUrl: './update-criteria-modal.component.html',
  styleUrls: ['./update-criteria-modal.component.less'],
})
export class UpdateCriteriaModalComponent {
  public createForm: FormGroup;
  public isEditing = false;
  public editor = ClassicEditor;
  public editorConfig = { ...editorConfig, placeholder: 'Описание' };
  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
  ) {
    this.createForm = this.fb.group({
      id: null,
      name: [null, Validators.required],
      description: [null, Validators.required],
    });
  }

  public dismiss() {
    this.modalService.dismissAll();
  }

  public setCriteria(criteria) {
    if (!criteria) {
      return;
    }
    this.createForm.patchValue(criteria);
    this.isEditing = true;
  }

  public close() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.activeModal.close(this.createForm.value);
  }
}
