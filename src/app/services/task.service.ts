import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaskResponse } from 'back/src/models/responses/task.response';
import { UpdateTaskRequest } from 'back/src/models/requests/task.models';

@Injectable()
export class TaskService {
  private readonly baseUrl = `${environment.baseUrl}/task`;
  constructor(private http: HttpClient) {}

  public getTask(taskId: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.baseUrl}/${taskId}`);
  }

  public downloadFile(taskId: number, fileId: number) {
    return this.http.get(`${this.baseUrl}/${taskId}/download-file/${fileId}`, {
      responseType: 'blob',
    });
  }

  public uploadFiles(taskId: number, data: FormData): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${taskId}/upload-files`, data);
  }

  public editTask(taskId: number, task: Partial<UpdateTaskRequest>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${taskId}/edit`, task);
  }

  public removeTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${taskId}/remove`);
  }

  public removeFile(taskId: number, fileId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${taskId}/remove-file/${fileId}`);
  }

  public updateTaskStatus(taskId: number, statusId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${taskId}/update-status`, { statusId });
  }
}
