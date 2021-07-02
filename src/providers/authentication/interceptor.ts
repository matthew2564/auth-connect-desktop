import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Platform } from 'ionic-angular';
import { AuthenticationProvider } from './authentication.provider';
import { from, Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private platform: Platform,
    private authProvider: AuthenticationProvider,
  ) {
  }

  intercept(req, next: HttpHandler): Observable<any> {
    return from(this.authProvider.getAuthenticationToken()).pipe(
      switchMap((res) => {
        if (res) {
          console.log(res);
          const newRequest = req.clone({
            setHeaders: {
              Authorization: res,
            },
          });
          return next.handle(newRequest);
        }
        return next.handle(req);
      })
    );
  }

}
