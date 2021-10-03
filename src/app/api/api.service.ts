import { Injectable } from '@angular/core';
import { HttpHeaders, HttpXsrfTokenExtractor, HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient, private tokenExtractor: HttpXsrfTokenExtractor) { }

  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }

  setHeaders() {
    if (this.decodejwts()) {
      return {
        headers: new HttpHeaders().set('Authorization', this.authHeader)
          .set('Content-Type', 'application/json')

      };
    } else {
      return {};
    }
  }

  getRequest(url: string) {
    const options = {};
    options['observe'] = 'response';
    options['headers'] = new HttpHeaders().set('Authorization', this.authHeader);

    return this.http.get(url, options);
  }
  postRequest(url: string, params: any) {
    return this.http.post(url, params, this.setHeaders());
  }
  putRequest(url: string, params: any) {
    return this.http.put(url, params, this.setHeaders());
  }

  decodejwts() {
    //todo:
    return false;
  }

}
