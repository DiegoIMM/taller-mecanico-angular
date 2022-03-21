import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';

//
// const apiUrl = 'http://127.0.0.1:8080/api/';
// const authUrl = 'http://127.0.0.1:8080/auth/';
// importar valor desde environment
const apiUrl = environment.apiUrl;
const authUrl = environment.authUrl;


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private token: string | undefined;
  httpOptionsWithToken: { headers: HttpHeaders };


  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
    this.httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
      })
    };
  }

  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error('Se captura el error: ', error);
      // TODO: send the error to remote logging infrastructure
      // console.log('error --->', error.error);
      // ////console.log(error.error.error.errorInfo[1]);
      // if (error.error.error.errorInfo[1] === 1062) {
      //   this._snackBar.open('El correo ya se encuentra en uso', ':(', {
      //     duration: 4000,
      //     panelClass: ['red', 'black-text'],
      //   });
      // }

      if (error.status === 400) {
        console.warn('asfdasdf' + error);
        this.snackBar.open(error, '', {
          duration: 4000,
          panelClass: ['red', 'white-text'],
          verticalPosition: 'top', // 'top' | 'bottom'
          horizontalPosition: 'end' // 'start' | 'center' | 'end' | 'left' | 'right'
        });

        this.router.navigated = false;
        // this.router.navigate(['/site']).then(() => {
        //   ////console.log(error.error.message);
        // });
      }
      if (error.status === 401) {
        this.router.navigated = false;
        this.snackBar.open('Sesión expirada, por seguridad inicie sesión nuevamente', 'ok', {
          duration: 20000,
          panelClass: ['red', 'white-text'],
          verticalPosition: 'top', // 'top' | 'bottom'
          horizontalPosition: 'end' // 'start' | 'center' | 'end' | 'left' | 'right'
        });
      }
      if (error.status === 403) {
        this.snackBar.open('Sesión expirada, por seguridad inicie sesión nuevamente', 'ok', {
          duration: 20000,
          panelClass: ['red', 'white-text'],
          verticalPosition: 'top', // 'top' | 'bottom'
          horizontalPosition: 'end' // 'start' | 'center' | 'end' | 'left' | 'right'
        });
        this.logoutUser();
      }
      if (error.status === 404) {
        this.router.navigated = false;
        this.router.navigate(['/site']).then(() => {
          // console.log(error.error.message);
        });
      } // log to console instead

      if (error.status === 409) {
        this.snackBar.open(error.error.message, '', {
          duration: 4000,
          panelClass: ['red', 'white-text'],
          verticalPosition: 'top', // 'top' | 'bottom'
          horizontalPosition: 'end' // 'start' | 'center' | 'end' | 'left' | 'right'
        });

      }

      if (error.statusText) {
        // this.toast.error('Problema de conectividad con integración, favor, intente en unos instantes.');
      }
      // if (error.status == 401) {  // TODO fix me para refresh
      //   localStorage.removeItem('access_token');
      //   localStorage.removeItem('expires_in');
      //   localStorage.removeItem('current_user');
      //   this.location.go('/auth/login');
      // }
      // Let the app keep running by returning an empty result.
      throw operation;
    };
  }

  logoutUser(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('current_user');
  }

  /**
   * Get the token from the local storage, if update this method, update the same in the api service too
   *
   */
  getHttpOptionsWithToken(): { headers: HttpHeaders } {
    if (!this.token) {
      this.token = localStorage.getItem('access_token')!;
    }

    return this.httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
      })
    };

  }

  updateToken(token: string): void {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  signUp(user: any): Observable<any> {
    return this.http.post<any>(authUrl + 'register', user, httpOptions)
      .pipe(catchError(this.handleError<any>('store User')));
  }

  getProfile(username: string): Observable<any> {
    return this.http
      .get(`${authUrl}user/${username}`, this.getHttpOptionsWithToken())
      .pipe(catchError(this.handleError('get getProfile')));
  }

  getActualUser(): Observable<any> {
    return this.http
      .get(authUrl + 'actualUser', this.getHttpOptionsWithToken())
      .pipe(catchError(this.handleError('get getActualUser')));
  }

  storeProfile(user: any): Observable<any> {
    return this.http
      .post<any>(apiUrl + 'userprofile', user, httpOptions)
      .pipe(catchError(this.handleError<any>('store userprofile')));
  }

  login(user: any): Observable<any> {
    return this.http.post<any>(`${authUrl}login`, user, httpOptions)
      .pipe(catchError(this.handleError<any>('store login')));
  }


  //TODO: Validar que solo devuelva los que tienen status habilitado

  addClient(client: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}cliente/insert`, client, httpOptions)
      .pipe(catchError(this.handleError<any>('add Client')));
  }


  getAllClients(): Observable<any> {
    return this.http
      .get(apiUrl + 'cliente/all', httpOptions)
      .pipe(catchError(this.handleError('get getAllClients')));
  }

  addCarPart(carPart: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}repuesto/insert`, carPart, httpOptions)
      .pipe(catchError(this.handleError<any>('add Repuesto')));
  }

  getAllCarParts(): Observable<any> {
    return this.http
      .get(apiUrl + 'repuesto/all', httpOptions)
      .pipe(catchError(this.handleError('get getAllRepuestos')));
  }


  addProviders(provider: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}proveedor/insert`, provider, httpOptions)
      .pipe(catchError(this.handleError<any>('add Proveedor')));
  }

  getAllProviders(): Observable<any> {
    return this.http
      .get(apiUrl + 'proveedor/all', httpOptions)
      .pipe(catchError(this.handleError('get getAllProveedores')));
  }


  addVehicle(vehicle: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}vehiculo/insert`, vehicle, httpOptions)
      .pipe(catchError(this.handleError<any>('add Vehiculo')));
  }

  getAllVehicles(): Observable<any> {
    return this.http
      .get(apiUrl + 'vehiculo/all', httpOptions)
      .pipe(catchError(this.handleError('get getAllVehiculos')));
  }

  addWorkOrder(workOrder: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}ordenTrabajo/insert`, workOrder, httpOptions)
      .pipe(catchError(this.handleError<any>('add orden de trabajo')));
  }

  getAllWorkOrders(): Observable<any> {
    return this.http
      .get(apiUrl + 'ordenTrabajo/all', httpOptions)
      .pipe(catchError(this.handleError('get getAllWorkOrders')));
  }


}
