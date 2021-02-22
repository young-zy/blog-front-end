import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { TokenResponse } from './entities/response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
    if (this.isTokenExpired()){
      this.loginStateSource.next(false);
    } else {
      this.loginStateSource.next(true);
    }
  }

  private loginStateSource = new ReplaySubject<boolean>(1);

  loginState = this.loginStateSource.asObservable();

  refreshToken(): Observable<TokenResponse> {
    return this.http.get<TokenResponse>(`${environment.baseURL}/auth/token`);
  }

  isTokenExpired(): boolean{
    const expire = window.localStorage.getItem('expire');
    return !(expire != null && new Date(expire).getTime() > new Date().getTime());
  }

  login(username: string, password: string): Observable<TokenResponse>{
    return new Observable<TokenResponse>( (observer) => {
      // check if token is valid
      if (!this.isTokenExpired()){
        this.loginStateSource.next(true);
        observer.error('already logged in');
        return;
      }
      this.http.post<TokenResponse>(`${environment.baseURL}/login`, {
        username,
        password
      }).subscribe(resp => {
          this.loginStateSource.next(true);
          window.localStorage.setItem('token', resp.token);
          window.localStorage.setItem('expire', resp.expire);
          observer.next(resp);
        },
       error => observer.error(error)
      );
      return;
    });
  }
}
