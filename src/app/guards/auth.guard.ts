import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
    console.log('AuthGuard');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): true|UrlTree {
    console.log('AuthGuard#canActivate called');
    return this.checkLogin()
  }

  checkLogin(): true|UrlTree {
    if (this.auth.isLogged()) { return true; }

    // Redirect to the login page
    return this.router.parseUrl('/auth/Login');
  }

}
