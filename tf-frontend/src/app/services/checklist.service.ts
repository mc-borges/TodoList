import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ChecklistData, ChecklistDataResponse } from '../helpers/types/checklist.type';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createChecklist(data: ChecklistData) {
    return this.http.post<ChecklistDataResponse>(`${this.apiUrl}/checklists`, data);
  }

  getChecklists() {
    return this.http.get<ChecklistDataResponse[]>(`${this.apiUrl}/checklists`);
  }

  getChecklistById(id: string) {
    return this.http.get<ChecklistDataResponse>(`${this.apiUrl}/checklists/${id}`);
  }

  updateChecklist(id: string, data: ChecklistData) {
    return this.http.put<ChecklistDataResponse>(`${this.apiUrl}/checklists/${id}`, data);
  }

  deleteChecklist(id: string) {
    return this.http.delete(`${this.apiUrl}/checklists/${id}`);
  }

  addTasksInChecklist(id: string, data: any[]) {
    return this.http.post<any>(`${this.apiUrl}/checklists/${id}/items`, data);
  }
}
