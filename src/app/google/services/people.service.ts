// src/app/google/services/people.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { OauthClient } from './oauth.client';
import { Person } from '../types/google/people';
import { ListConnectionsOptions, ListConnectionsResponse } from '../types/google/people/connections';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private readonly http = inject(HttpClient);
  private readonly oauthClient = inject(OauthClient);

  private readonly baseUrl = 'https://people.googleapis.com/v1';

  /**
   * ดึงรายการผู้ติดต่อ (Connections)
   */
  async getConnections(options: ListConnectionsOptions): Promise<ListConnectionsResponse> {
    const headers = await this.oauthClient.getAuthorizationHeaders();
    
    // แปลงอาร์เรย์ของ personFields ให้เป็น string ที่คั่นด้วยลูกน้ำ
    const params: Record<string, string | number | boolean> = {
      personFields: options.personFields.join(','),
    };

    if (options.pageSize) params['pageSize'] = options.pageSize;
    if (options.pageToken) params['pageToken'] = options.pageToken;
    if (options.sortOrder) params['sortOrder'] = options.sortOrder;

    return firstValueFrom(
      this.http.get<ListConnectionsResponse>(`${this.baseUrl}/people/me/connections`, {
        headers: { ...headers },
        params,
      }),
    );
  }

  /**
   * สร้างผู้ติดต่อใหม่ (Create Contact)
   */
  async createContact(person: Person): Promise<Person> {
    const headers = await this.oauthClient.getAuthorizationHeaders();

    return firstValueFrom(
      this.http.post<Person>(`${this.baseUrl}/people:createContact`, person, {
        headers: { ...headers },
      }),
    );
  }
  
  /**
   * ลบผู้ติดต่อ (Delete Contact)
   * @param resourceName ไอดีของผู้ติดต่อ (เช่น 'people/c12345')
   */
  async deleteContact(resourceName: string): Promise<void> {
    const headers = await this.oauthClient.getAuthorizationHeaders();

    return firstValueFrom(
      this.http.delete<void>(`${this.baseUrl}/${resourceName}:deleteContact`, {
        headers: { ...headers },
      }),
    );
  }
}