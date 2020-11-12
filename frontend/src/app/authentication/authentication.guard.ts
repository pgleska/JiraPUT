import {Injectable} from '@angular/core';
import {map, take} from 'rxjs/operators';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
    constructor(private authService: AuthenticationService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.user.pipe(
            take(1),
            map(user => {
                if (user) {
                    return true;
                }
                return this.router.createUrlTree(['/login']);
            })
        );
    }


}
