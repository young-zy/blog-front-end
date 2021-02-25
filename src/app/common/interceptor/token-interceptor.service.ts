import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private userService: UserService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // get token and expire from localstorage
    const token = window.localStorage.getItem('token');
    const expire = window.localStorage.getItem('expire');

    let newHeaders = req.headers
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    if (token != null) {
      newHeaders = newHeaders.append('Authorization', `Bearer ${token}`);
      if (expire != null && req.url !== `${environment.baseURL}/auth/token`) {
        const date = new Date(expire);
        const lag = date.getTime() - new Date().getTime();
        if (lag < 3600) {
          this.userService.refreshToken().subscribe(
            resp => {
              window.localStorage.setItem('token', resp.token);
              window.localStorage.setItem('expire', resp.expire);
            },
            () => {
              console.log('token expired');
              window.localStorage.removeItem('token');
              window.localStorage.removeItem('expire');
            }
          );
        }
      }
    }
    const request = req.clone( { headers: newHeaders } );
    return next.handle(request);
  }
}
