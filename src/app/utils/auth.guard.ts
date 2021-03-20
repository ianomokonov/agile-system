import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUserToken = this.tokenService.getAuthToken();
    if (currentUserToken) {
      return true;
    }
    this.router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
