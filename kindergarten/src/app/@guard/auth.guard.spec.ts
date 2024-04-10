import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CookieService } from 'ngx-cookie-service';

describe('authGuard', () => {
  let router: Router;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    router = TestBed.inject(Router);
    cookieService = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    const authGuard = new AuthGuard(router, cookieService);
    expect(authGuard).toBeTruthy();
  });
});
