import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {User} from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | undefined;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private api: ApiService) {
  }


  private saveToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.token = token;
    this.api.updateToken(token);
  }

  /**
   * Get the token from the local storage, if update this method, update the same in the api service too
   *
   */
  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('access_token')!;
    }
    return this.token;
  }

  saveUser(user: any): void {
    localStorage.setItem('current_user', JSON.stringify(user));

  }

  getCurrentUser(): User | null {
    const userString = localStorage.getItem('current_user');
    console.log(userString);
    if (userString != null || userString !== undefined) {
      if (userString) {
        return User.fromJson(JSON.parse(userString));
      }
    }
    return null;
  }

  getUserName(): any {
    const userString = localStorage.getItem('current_user');
    if (userString != null || userString !== undefined) {
      if (userString) {
        return JSON.parse(userString).username;
      }
    }
  }


  isLogged(): boolean {
    const userString = localStorage.getItem('current_user');
    return !!userString;
  }

  logoutUser(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('current_user');
  }

}
