import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaskResponse } from 'back/src/models/responses/task.response';
import { CreateTaskRequest, UpdateTaskRequest } from 'back/src/models/requests/task.models';
// eslint-disable-next-line import/no-cycle
import { map, switchMap, tap } from 'rxjs/operators';
import { FileSaverService } from 'ngx-filesaver';
import { TaskShortView } from 'back/src/models/responses/task-short-view';
import { TaskHistory } from 'back/src/models/responses/task-history';
import { ProjectDataService } from './project-data.service';
import { UploadFile } from '../shared/multiple-file-uploader/multiple-file-uploader.component';

@Injectable()
export class TaskService {
  private baseUrl = `${environment.baseUrl}/project`;
  constructor(
    private http: HttpClient,
    private projectDataService: ProjectDataService,
    private fileSaver: FileSaverService,
  ) {}

  public addTask(projectId: number, task: CreateTaskRequest): Observable<number> {
    const { files } = task;
    // eslint-disable-next-line no-param-reassign
    delete task.files;
    return this.http.post<number>(`${this.baseUrl}/${projectId}/add-task`, task).pipe(
      switchMap((taskId) => {
        if (!files?.length) {
          return of(taskId);
        }
        const formData = new FormData();
        files.forEach((file: UploadFile) => {
          if (file.file) {
            formData.append('files', file.file);
          }
        });
        return this.uploadFiles(taskId, formData).pipe(map(() => taskId));
      }),
    );
  }

  public getTask(taskId: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(
      `${this.baseUrl}/${this.projectDataService.project?.id}/task/${taskId}`,
    );
  }

  public search(searchString: string): Observable<TaskShortView[]> {
    return this.http.get<TaskShortView[]>(
      `${this.baseUrl}/${this.projectDataService.project?.id}/task/search?searchString=${
        searchString ? encodeURI(searchString) : ''
      }`,
    );
  }

  public getHistory(taskId: number): Observable<TaskHistory[]> {
    return this.http.get<TaskHistory[]>(
      `${this.baseUrl}/${this.projectDataService.project?.id}/task/${taskId}/history`,
    );
  }

  public getAcceptanceCriteria(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/${this.projectDataService.project?.id}/task/${taskId}/acceptance-criteria`,
    );
  }

  public getComments(taskId: number): Observable<any[]> {
    return of([
      {
        user: {
          name: 'Иван',
          surname: 'Номоконов',
        },
        text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Consectetur accusantium provident magni officia eligendi
           voluptates dolore aut error at veritatis tempore ad nostrum 
           saepe sint consequuntur quo, eaque sequi libero amet ratione, 
           quasi rerum quisquam placeat consequatur. Magnam quae atque 
           similique commodi, non distinctio? Molestiae numquam nobis voluptatem odio quae!`,
        createDate: new Date(),
      },
      {
        user: {
          name: 'Иван',
          surname: 'Номоконов',
        },
        isMy: true,
        text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Consectetur accusantium provident magni officia eligendi
           voluptates dolore aut error at veritatis tempore ad nostrum 
           saepe sint consequuntur quo, eaque sequi libero amet ratione, 
           quasi rerum quisquam placeat consequatur. Magnam quae atque 
           similique commodi, non distinctio? Molestiae numquam nobis voluptatem odio quae!`,
        createDate: new Date(),
      },
    ]);
    // return this.http.get<any[]>(
    //   `${this.baseUrl}/${this.projectDataService.project?.id}/task/${taskId}/comments`,
    // );
  }

  public downloadFile(taskId: number, file: UploadFile) {
    return this.http
      .get(
        `${this.baseUrl}/${this.projectDataService.project?.id}/task/${taskId}/download-file/${file.id}`,
        {
          responseType: 'blob',
        },
      )
      .pipe(
        tap((response) => {
          this.fileSaver.save(response, file.name);
        }),
      );
  }

  public uploadFiles(taskId: number, data: FormData): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${this.projectDataService.project?.id}/task/${taskId}/upload-files`,
      data,
    );
  }

  public editTask(taskId: number, task: Partial<UpdateTaskRequest>): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${this.projectDataService.project?.id}/task/${taskId}/edit`,
      task,
    );
  }

  public removeTask(taskId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${this.projectDataService.project?.id}/task/${taskId}/remove`,
    );
  }

  public removeFile(taskId: number, fileId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${this.projectDataService.project?.id}/task/${taskId}/remove-file/${fileId}`,
    );
  }

  public updateTaskStatus(taskId: number, statusId: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${this.projectDataService.project?.id}/task/${taskId}/update-status`,
      { statusId },
    );
  }
}
