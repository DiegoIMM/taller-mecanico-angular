import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  logInForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private api: ApiService,
              private router: Router, private snackBar: MatSnackBar) {
    this.logInForm = fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit(): void {
  }

  logIn(): void {
    this.api.login(this.logInForm.value).subscribe((res) => {
      console.log('res', res);
      this.auth.saveUser(res.token, res.user);
      if (res.user){
        this.router.navigate(['/app']);
        this.snackBar.open('Sesión iniciada correctamente', '', {
          duration: 2000,
        });
      }
      // console.debug('Respuesta Login', res);
      // this.auth.saveToken(res.token);
      // this.auth.existUserProfile(res.user.email);
      // this.auth.setUser(res.user);
      //   // this.router.navigate(['site/profile']);


    }, (error) => {
      console.log('err', error);

    });
  }

}
