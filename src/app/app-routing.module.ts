import {Injectable, NgModule} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  DetachedRouteHandle,
  RouteReuseStrategy,
  RouterModule, RouterStateSnapshot,
  Routes, UrlTree
} from '@angular/router';

import {NotFoundComponent} from './pages/not-found/not-found.component';
import {AuthService} from './services/auth.service';
import {Observable} from 'rxjs';
import {AuthGuard} from './guards/auth.guard';


@Injectable()
export class MyStrategy extends RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false;
  }
}


const routes: Routes = [
  {path: '', redirectTo: 'app', pathMatch: 'full'},
  {
    path: 'app',
    loadChildren: () => import('./pages/app/app.module').then(m => m.AppModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
  },
  {path: '**', redirectTo: '404'},
  {path: '404', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'

  })],
  exports: [RouterModule],
  providers: [{provide: RouteReuseStrategy, useClass: MyStrategy}]

})
export class AppRoutingModule {}
