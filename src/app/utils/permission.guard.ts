import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectDataService } from '../services/project-data.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private router: Router, private projectDataService: ProjectDataService) {}
  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    if (!route.data.roles || route.data.roles.some((role) => this.projectDataService.PID[role])) {
      return true;
    }

    this.router.navigate(['/not-found']);
    return false;
  }
}
