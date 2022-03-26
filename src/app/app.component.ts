import {ChangeDetectorRef, Component} from '@angular/core';
import {User} from './models/User';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {ApiService} from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public auth: AuthService,
              private router: Router, private api: ApiService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', () => this.mobileQueryListener);

  }

  title = 'Taller';
  profile: User | undefined;

  ngOnInit(): void {
    // console.warn('Aquí se chequea el token');
    // const token = localStorage.getItem('access_token');
    // console.log(token);
    // if (token) {
    //
    //   this.api.getActualUser().subscribe(
    //     (user: any) => {
    //       // this.profile = user;
    //       console.log(user);
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );
    // }
    //

  }


  goToProfile(): void {

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  logout(): void {
    this.auth.logoutUser();

  }
}
