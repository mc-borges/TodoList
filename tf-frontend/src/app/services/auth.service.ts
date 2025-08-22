import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { UserLogin, UserSignup } from '../helpers/types/user.type';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  signup(data: UserSignup) {
    return this.http.post<any>(`${this.apiUrl}/auth/signup`, data);
  }

  login(data: UserLogin) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, data).pipe(
      tap(res => this.setToken(res.access_token))
    );
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
