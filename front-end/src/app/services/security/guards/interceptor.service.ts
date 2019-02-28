import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../authentication.service';
import { constants } from 'environments/constants';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable({
  providedIn: 'root'
})
/**
 * The HttpClient request interceptor
 * >> Intercept all the request used by the HttpClient module
 * 
 * @author EL OUFIR Hatim <eloufirhatim@gmail.com>
 */
export class InterceptorService implements HttpInterceptor {

  /**
   * Service constructor
   * 
   * @param router The router object
   * @param authenticationService The authentication service
   *
   * @author EL OUFIR Hatim <eloufirhatim@gmail.com>
   */
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {

  }

  /**
   * Inject Authorization header into the request
   * 
   * @param req The http request object
   *
   * @author EL OUFIR Hatim <eloufirhatim@gmail.com>
   */
  private applyCredentials(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem(constants.access_token)}`
      }
    });
  }

  /**
   * Intercept all HttpClient request
   * 
   * @param req The http request object
   * @param next The next router to go to it
   *
   * @author EL OUFIR Hatim <eloufirhatim@gmail.com>
   */
  intercept(
    req: HttpRequest<any>, next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.doRequest(req, next, true);
  }

  /**
   * Execute the next http request
   * 
   * @param req The http request
   * @param next The next http request to go to it
   * @param setAuthorization A flag if set to TRUE the access token needs to be injected
   *
   * @author EL OUFIR Hatim <eloufirhatim@gmail.com>
   */
  private doRequest(req: HttpRequest<any>, next: HttpHandler, setAuthorization = false): any {
    if (setAuthorization) {
      req = this.applyCredentials(req);
    }
    return next.handle(req)
      .catch(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.authenticationService.logout();
          } else if (err.status === 500) {
            this.router.navigateByUrl(constants.error_500);
          }
        }
        return ErrorObservable.create(new Error(err));
      });
  }
}
