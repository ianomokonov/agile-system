import { Injectable } from '@angular/core';
import { GetProfileInfoResponse } from 'back/src/models/responses/get-profile-info.response';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable()
export class ProfileService {
  private user: GetProfileInfoResponse | undefined;
  constructor(private userService: UserService) {}

  public getUser(): Observable<GetProfileInfoResponse> {
    if (this.user) {
      return of(this.user);
    }

    return this.userService.getProfile().pipe(
      tap((user) => {
        this.user = user;
      }),
    );
  }

  public logout() {
    return this.userService.logout().pipe(
      tap(() => {
        if (this.user) {
          this.user = undefined;
        }
      }),
    );
  }
}
