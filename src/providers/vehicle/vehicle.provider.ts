import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ENV } from '../../environment/environment';
import { catchError } from 'rxjs/operators';

@Injectable()
export class VehicleProvider {

  constructor(private http: HttpClient) {
  }

  getVehicleByIdentifier = (identifier: string) => {
    const httpParams = new HttpParams().set('identifier', identifier);
    const headers = new HttpHeaders().set('x-api-key', ENV.apiKey);

    return this.http
      .get(ENV.url, { headers, params: httpParams })
      .pipe(
        catchError((err) => throwError(new Error(err.status))),
      );
  }
}
