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
  private taskId: number;

  constructor(private taskService: TaskService, private activatedRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.taskId = params.taskId;
      this.getComments();
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

    this.taskService.updateComment(comment.id, { text: commentText.value }).subscribe(() => {
      comment.text = commentText.value;
      comment.isEditing = false;
    });
  }

  public createComment() {
    if (this.newCommentControl.invalid) {
      this.newCommentControl.markAsTouched();
      return;
    }

    this.taskService
      .createComment(this.taskId, { text: this.newCommentControl.value })
      .subscribe(() => {
        this.newCommentControl.reset();
        this.getComments();
      });
  }

  public cancelUpdate(commentTemp, commentText: FormControl) {
    const comment = commentTemp;
    comment.isEditing = false;
    commentText.setValue(comment.text);
  }

  public removeComment(comment) {
    if (!comment.isMy) {
      return;
    }
    this.taskService.removeComment(comment.id).subscribe(() => {
      this.getComments();
    });
  }

  private getComments(taskId: number = this.taskId) {
    this.taskService.getComments(taskId).subscribe((comments) => {
      this.comments = comments;
      this.commentTexts.clear();
      comments.forEach((c) => {
        this.commentTexts.push(new FormControl(c.text, Validators.required));
      });
    });
  }
}
