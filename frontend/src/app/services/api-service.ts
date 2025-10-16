import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = '/api'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  create(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${API}/${endpoint}`, data);
  }
}
