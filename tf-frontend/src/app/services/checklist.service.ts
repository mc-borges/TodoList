import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ChecklistDataResponse, ChecklistItemsBulkUpdate, ChecklistItemsBulkResponse } from '../helpers/types/checklist.type';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createChecklist(data: ChecklistDataResponse) {
    return this.http.post<ChecklistDataResponse>(`${this.apiUrl}/checklists`, data);
  }

  getChecklists() {
    return this.http.get<ChecklistDataResponse[]>(`${this.apiUrl}/checklists`);
  }

  getChecklistById(id: string) {
    return this.http.get<ChecklistDataResponse>(`${this.apiUrl}/checklists/${id}`);
  }

  updateChecklist(id: string, data: ChecklistDataResponse) {
    return this.http.put<ChecklistDataResponse>(`${this.apiUrl}/checklists/${id}`, data);
  }

  deleteChecklist(id: string) {
    return this.http.delete(`${this.apiUrl}/checklists/${id}`);
  }

  updateChecklistItems(checklistId: string, data: ChecklistItemsBulkUpdate) {
    return this.http.put<ChecklistItemsBulkResponse>(`${this.apiUrl}/checklists/${checklistId}/items`, data);
  }

  getRandomMessage() {
    return this.http.get<any[]>('json/frases.json');
  }
}
