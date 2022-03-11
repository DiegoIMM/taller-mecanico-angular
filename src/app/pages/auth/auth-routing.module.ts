import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {AuthComponent} from './auth.component';
import {RecoveryPassComponent} from './recovery-pass/recovery-pass.component';
import {NotFoundComponent} from '../not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children:
      [
        {path: 'Login', component: LoginComponent},
        {path: 'SignUp', component: SignupComponent},
        {path: 'recovery-password', component: RecoveryPassComponent},
        {path: '**', redirectTo: 'Login'}
      ]
  },
  {path: '**', redirectTo: '404'},
  {path: '404', component: NotFoundComponent}

// TODO: Implementar los componentes faltantes
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
