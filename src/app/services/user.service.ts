import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUserRequest } from 'back/src/models/requests/create-user.request';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { TokensResponse } from 'back/src/models/responses/tokens.response';
import { Observable, throwError } from 'rxjs';
import { GetProfileInfoResponse } from 'back/src/models/responses/get-profile-info.response';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { TokenService } from './token.service';

@Injectable()
export class UserService {
  private readonly baseUrl = `${environment.baseUrl}/user`;
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public signUp(user: CreateUserRequest): Observable<TokensResponse> {
    return this.http.post<TokensResponse>(`${this.baseUrl}/sign-up`, user).pipe(
      tap((tokens) => {
        this.tokenService.storeTokens(tokens);
      }),
    );
  }

  public login(email: string, password: string): Observable<TokensResponse> {
    return this.http
      .post<TokensResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap((tokens) => {
          this.tokenService.storeTokens(tokens);
        }),
      );
  }

  public refreshToken(token: string): Observable<TokensResponse> {
    return this.http
      .post<TokensResponse>(`${this.baseUrl}/refresh`, { token })
      .pipe(
        tap((tokens: TokensResponse) => {
          this.tokenService.storeTokens(tokens);
        }),
      );
  }

  public getProfile() {
    return this.http.get<GetProfileInfoResponse>(`${this.baseUrl}/profile`);
  }

  public getUsers(searchString?: string) {
    return this.http.get<UserShortView[]>(
      `${this.baseUrl}/users?searchString=${searchString ? encodeURI(searchString) : ''}`,
    );
  }

  public editProfile(user: FormData) {
    return this.http.put(`${this.baseUrl}/profile`, user);
  }

  public logout() {
    return this.http
      .delete(`${this.baseUrl}/logout?token=${this.tokenService.getRefreshToken()}`)
      .pipe(
        tap(() => {
          this.tokenService.removeTokens();
        }),
        catchError((error) => {
          this.tokenService.removeTokens();
          return throwError(error);
        }),
      );
  }
}
