import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PeopleService } from '../../services/people.service';
import { Person } from '../../types/google/people';

@Component({
  selector: 'app-people-list-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './people-list-page.html',
  styleUrl: './people-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleListPage implements OnInit {
  private readonly peopleService = inject(PeopleService);

  // 👇 แก้ไข 1: เติม readonly เข้าไปใน Signal
  protected readonly connections = signal<readonly Person[]>([]);
  protected readonly searchQuery = signal<string>('');
  protected readonly isLoading = signal<boolean>(true);

  protected readonly filteredConnections = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.connections();
    
    if (!query) {
      return list;
    }

    return list.filter(person => {
      // 👇 แก้ไข 2: เอา ? ออก และใช้เช็ค truthy แทนเพื่อไม่ให้ Compiler แจ้งเตือน
      const name = (person.names && person.names[0]) ? person.names[0].displayName.toLowerCase() : '';
      const emails = person.emailAddresses ? person.emailAddresses.map(e => e.value.toLowerCase()).join(' ') : '';
      
      return name.includes(query) || emails.includes(query);
    });
  });

  async ngOnInit() {
    try {
      const response = await this.peopleService.getConnections({
        personFields: ['names', 'emailAddresses', 'phoneNumbers', 'photos'],
        pageSize: 100,
        sortOrder: 'FIRST_NAME_ASCENDING'
      });
      this.connections.set(response.connections || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
  // เพิ่มฟังก์ชันนี้ลงไปในคลาส PeopleListPage
  async deleteContact(resourceName: string) {
    // ถามเพื่อความแน่ใจก่อนลบ
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      // เรียกใช้ Service เพื่อลบข้อมูลที่ Google
      await this.peopleService.deleteContact(resourceName);
      
      // อัปเดต State หน้าจอ โดยกรองเอาคนที่ลบออก (ไม่ต้องโหลด API ใหม่ทั้งหมด)
      this.connections.update((list) => 
        list.filter((person) => person.resourceName !== resourceName)
      );
      
      alert('Contact deleted successfully.');
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact.');
    }
  }
}