import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { TokenResponse } from './entities/response';
import { User } from './entities/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private selfInfoSource: ReplaySubject<User> = new ReplaySubject<boolean>(1);
  private selfInfoSource = new ReplaySubject<User>(1);
  selfInfo = this.selfInfoSource.asObservable();
  private loginStateSource = new ReplaySubject<boolean>(1);
  loginState = this.loginStateSource.asObservable();

  constructor(private http: HttpClient) {
    if (this.isTokenExpired()) {
      this.loginStateSource.next(false);
    } else {
      this.loginStateSource.next(true);
      this.getSelf();
      // this.http.get<User>(`${environment.baseURL}/user`).pipe(share()).subscribe();
    }
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
          this.getSelf();
          observer.next(resp);
        },
        error => observer.error(error)
      );
      return;
    });
  }

  logout(): void {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('expire');
    window.sessionStorage.removeItem('user');
    this.loginStateSource.next(false);
  }

  getSelf(): void {
    const userStr = window.sessionStorage.getItem('user');
    if (userStr == null) {
      this.http.get<User>(`${environment.baseURL}/user`).subscribe(next => {
        window.sessionStorage.setItem('user', JSON.stringify(next));
        this.selfInfoSource.next(next);
      });
    } else {
      const user = JSON.parse(userStr) as User;
      this.selfInfoSource.next(user);
    }
  }
}
