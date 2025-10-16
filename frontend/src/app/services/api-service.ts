import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Combination, CreateCombinationRequest, CombinationResponse } from '../models';

const API = '/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  getCombinations(): Observable<Combination[]> {
    return this.http.get<Combination[]>(`${API}/combinations`);
  }

  createCombination(data: CreateCombinationRequest): Observable<CombinationResponse> {
    return this.http.post<CombinationResponse>(`${API}/combinations`, data);
  }

  getCombination(id: number): Observable<Combination> {
    return this.http.get<Combination>(`${API}/combinations/${id}`);
  }
}
