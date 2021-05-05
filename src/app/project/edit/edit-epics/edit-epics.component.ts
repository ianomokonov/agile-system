import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectEpicResponse } from 'back/src/models/responses/project-epic.response';
import { takeWhile } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-edit-epics',
  templateUrl: './edit-epics.component.html',
  styleUrls: ['./edit-epics.component.less'],
})
export class EditEpicsComponent {
  private rxAlive = true;
  private projectId: number;
  public projectEpics: ProjectEpicResponse[];
  public editingEpic: ProjectEpicResponse | undefined;
  public epicForm: FormGroup;
  public allEpicsIncluded = true;

  public get color() {
    return this.epicForm.get('color')?.value;
  }

  public set color(value) {
    this.epicForm.patchValue({ color: value });
  }

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.parent?.params.pipe(takeWhile(() => this.rxAlive)).subscribe((params) => {
      this.projectId = params.id;
      this.getProjectInfo();
    });
    this.epicForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      color: [
        null,
        [
          (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value === '') {
              return { noValue: true };
            }
            return null;
          },
          // eslint-disable-next-line complexity
          (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value) {
              if (
                (control.value[0] !== '#' || control.value.length !== 7) &&
                (control.value.substring(0, 3) !== 'rgb' ||
                  control.value.length > 22 ||
                  control.value.length < 13)
              ) {
                return { badFormat: true };
              }
            }
            return null;
          },
        ],
      ],
    });
  }

  private getProjectInfo() {
    this.projectService
      .getProjectEpics(this.projectId)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((epics: ProjectEpicResponse[]) => {
        this.projectEpics = epics;
      });
  }

  public onEpicClick(epic?: ProjectEpicResponse) {
    this.editingEpic = epic;
    if (!this.editingEpic) {
      this.epicForm.reset();
      this.color = '';
      return;
    }
    this.epicForm.patchValue({
      name: this.editingEpic.name,
      description: this.editingEpic.description,
      color: this.editingEpic.color,
    });
  }

  public removeEpic(epicId: number) {
    this.projectService
      .removeProjectEpic(this.projectId, epicId)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.onEpicClick();
        this.getProjectInfo();
      });
  }

  public saveProjectEpic() {
    if (this.epicForm.invalid) {
      this.epicForm.markAllAsTouched();
      return;
    }

    const formValue = this.epicForm.getRawValue();
    this.getRequest(formValue)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.onEpicClick();
        this.getProjectInfo();
      });
  }

  private getRequest(formValue: any) {
    if (this.editingEpic) {
      return this.projectService.editProjectEpic(this.projectId, {
        epicId: this.editingEpic.id,
        name: formValue.name,
        description: formValue.description,
        color: formValue.color,
      });
    }

    return this.projectService.addProjectEpic(this.projectId, {
      name: formValue.name,
      description: formValue.description,
      color: formValue.color,
    });
  }

  public changeColor(event) {
    if (event) {
      this.color = event;
    }
  }
}
