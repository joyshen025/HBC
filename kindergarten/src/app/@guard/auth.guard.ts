import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path;

    if (path === 'permissions') {
      return this.canActivatePermissions();
    } else {
      return this.canActivateGeneral();
    }
  }

  private canActivateGeneral(): boolean {
    let isLoggedIn = this.cookieService.get('isLoggedIn') === 'true';
    if (isLoggedIn) {
      this.refreshLoginSession();
      return true;
    } else {
      this.router.navigate(['/Login']);
      alert('請先登入');
      return false;
    }
  }

  private canActivatePermissions(): boolean {
    let hasPermissions = this.cookieService.get('permissions') === 'true';
    if (!hasPermissions) {
      this.router.navigate(['/Interface']);
      alert('您沒有權限。');
      return false;
    }
    this.refreshLoginSession();
    return true;
  }

  private refreshLoginSession(): void {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 10);
    this.cookieService.set('isLoggedIn', 'true', expirationDate);
  }
}
