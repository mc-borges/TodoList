import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ChecklistData, ChecklistDataResponse, ChecklistItemsBulkUpdate, ChecklistItemsBulkResponse } from '../helpers/types/checklist.type';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createChecklist(data: ChecklistData) {
    // Transform camelCase to snake_case for backend
    const backendData = {
      name: data.name,
      category: data.category,
      description: data.description,
      limit_date: data.limitDate,
      change_color_by_date: data.changeColorByDate,
      show_motivational_msg: data.showMotivationalMsg
    };
    return this.http.post<ChecklistDataResponse>(`${this.apiUrl}/checklists`, backendData);
  }

  getChecklists() {
    return this.http.get<ChecklistDataResponse[]>(`${this.apiUrl}/checklists`);
  }

  getChecklistById(id: string) {
    return this.http.get<ChecklistDataResponse>(`${this.apiUrl}/checklists/${id}`);
  }

  updateChecklist(id: string, data: ChecklistData) {
    // Transform camelCase to snake_case for backend
    const backendData = {
      name: data.name,
      category: data.category,
      description: data.description,
      limit_date: data.limitDate,
      change_color_by_date: data.changeColorByDate,
      show_motivational_msg: data.showMotivationalMsg
    };
    return this.http.put<ChecklistDataResponse>(`${this.apiUrl}/checklists/${id}`, backendData);
  }

  deleteChecklist(id: string) {
    return this.http.delete(`${this.apiUrl}/checklists/${id}`);
  }

  // NOVO MÉTODO OTIMIZADO: Atualiza todos os itens da checklist em lote
  updateChecklistItems(checklistId: string, data: ChecklistItemsBulkUpdate) {
    return this.http.put<ChecklistItemsBulkResponse>(`${this.apiUrl}/checklists/${checklistId}/items`, data);
  }

  // MÉTODO LEGADO (removido): addTasksInChecklist
  // Substituído por updateChecklistItems para operações em lote
}
