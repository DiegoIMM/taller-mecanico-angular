import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TermsComponent} from '../terms/terms.component';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {Observable, of} from 'rxjs';
import {avoidSimbols} from '../../../helpers/avoidSimbols';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  hide = true;
  hide2 = true;
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private auth: AuthService,
              private router: Router, private snackBar: MatSnackBar, private api: ApiService
  ) {
    this.signUpForm = fb.group({
      username: new FormControl('', [Validators.required, avoidSimbols]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(6)]),
      terms: new FormControl(false, [Validators.requiredTrue])
    });
    // tslint:disable-next-line:no-non-null-assertion
    this.signUpForm!
      .get('password2')!
      // tslint:disable-next-line:no-non-null-assertion
      .setValidators([Validators.required, CustomValidators.equals(this.signUpForm.get('password')!)]);

  }

  ngOnInit(): void {
    // tslint:disable-next-line:no-non-null-assertion
    this.signUpForm.get('username')!.valueChanges.subscribe((event) => {
      // tslint:disable-next-line:no-non-null-assertion
      this.signUpForm.get('username')!.setValue(event.toLowerCase().trim(), {emitEvent: false});
    });
  }

  openTerms(): void {
    this.dialog.open(TermsComponent, {width: '750px'});
  }

  createAccount(): void {
    // //console.log('SignUp ->', this.signUpFrom.value);
    this.api.signUp(this.signUpForm.value).subscribe(
      (res) => {
        console.warn('res -> ', res);
        if (res) {
          this.auth.saveUser(res.token, res.user);

          this.router.navigate(['/app']);
          this.snackBar.open('Sesión iniciada correctamente', '', {
            duration: 2000
          });
        }

      },
      (err) => {
        console.warn('err -> ', err);

      }
    );
  }


  userExist(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<any> | Observable<any> => {
      return new Promise((resolve, reject) => {

        // this.api.existsUsername(control.value).subscribe((res) => {
        //   if (res.exists) {
        //     resolve({existe: true});
        //   } else {
        //     resolve(null);
        //   }
        // });
        return null;
      });
    };
  }

}


function equalsValidator(otherControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value: string = control.value;
    const otherValue: any = otherControl.value;
    return otherValue === value ? null : {notEquals: {value, otherValue}};
  };
}


export const CustomValidators = {
  equals: equalsValidator
};
