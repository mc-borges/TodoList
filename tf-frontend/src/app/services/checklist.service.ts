import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ChecklistData } from '../helpers/types/checklist.type';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createChecklist(data: ChecklistData) {
    return this.http.post<any>(`${this.apiUrl}/checklists`, data);
  }
}
