import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class DailyService {
  private readonly baseUrl = `${environment.baseUrl}/project`;
  constructor(private http: HttpClient) {}

  public read(projectId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${projectId}/daily`);
  }
}
