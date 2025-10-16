import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Combination, CreateCombinationRequest, CombinationResponse, CombinationQueryParams } from '../models/combination.model';

const API = '/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  getCombinations(queryParams?: CombinationQueryParams): Observable<Combination[]> {
    let params = new HttpParams();

    if (queryParams?.sort_by) {
      params = params.set('sort_by', queryParams.sort_by);
    }

    if (queryParams?.sort_order) {
      params = params.set('sort_order', queryParams.sort_order);
    }

    return this.http.get<Combination[]>(`${API}/combinations`, { params });
  }

  createCombination(data: CreateCombinationRequest): Observable<CombinationResponse> {
    return this.http.post<CombinationResponse>(`${API}/combinations`, data);
  }

  getCombination(id: number): Observable<Combination> {
    return this.http.get<Combination>(`${API}/combinations/${id}`);
  }
}
