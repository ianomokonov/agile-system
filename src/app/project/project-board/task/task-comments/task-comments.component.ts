import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TaskService } from 'src/app/services/task.service';
import { editorConfig } from 'src/app/utils/constants';

@Component({
  selector: 'app-task-comments',
  templateUrl: './task-comments.component.html',
  styleUrls: ['./task-comments.component.less'],
})
export class TaskCommentsComponent implements OnInit {
  public editor = ClassicEditor;
  public editorConfig = { ...editorConfig, placeholder: 'Введите комментарий' };
  public newCommentControl = new FormControl(null, Validators.required);
  public commentTexts: FormArray = new FormArray([]);
  public comments: any[];

  constructor(private taskService: TaskService, private activatedRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.getComments(params.taskId);
    });
  }

  public getTextControl(index) {
    return this.commentTexts.at(index) as FormControl;
  }

  public updateComment(commentTemp, commentText: FormControl) {
    const comment = commentTemp;
    if (!comment.isEditing) {
      comment.isEditing = true;
      return;
    }

    if (commentText.invalid) {
      commentText.markAsTouched();
      return;
    }

    comment.text = commentText.value;
    comment.isEditing = false;
  }

  public cancelUpdate(commentTemp, commentText: FormControl) {
    const comment = commentTemp;
    comment.isEditing = false;
    commentText.setValue(comment.text);
  }

  private getComments(taskId: number) {
    this.taskService.getComments(taskId).subscribe((comments) => {
      this.comments = comments;
      this.commentTexts.clear();
      comments.forEach((c) => {
        this.commentTexts.push(new FormControl(c.text, Validators.required));
      });
    });
  }
}
