/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PeopleService } from '../../services/people.service';
import { Person } from '../../types/google/people';

@Component({
  selector: 'app-create-contact-page',
  imports: [ReactiveFormsModule], // นำเข้าเพื่อใช้ Reactive Forms
  templateUrl: './create-contact-page.html',
  styleUrl: './create-contact-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateContactPage {
  private readonly fb = inject(FormBuilder);
  private readonly peopleService = inject(PeopleService);
  private readonly router = inject(Router);

  // สร้างโครงสร้างฟอร์ม
  protected readonly contactForm = this.fb.group({
    givenName: ['', Validators.required], // ชื่อบังคับกรอก
    familyName: [''],
    emails: this.fb.array([]), // อาร์เรย์เก็บอีเมลหลายอัน
    phones: this.fb.array([]), // อาร์เรย์เก็บเบอร์โทรหลายอัน
  });

  // Getter สำหรับดึง FormArray มาใช้ใน HTML ได้ง่ายๆ
  get emails() { return this.contactForm.get('emails') as FormArray; }
  get phones() { return this.contactForm.get('phones') as FormArray; }

  // ฟังก์ชันเพิ่มฟิลด์อีเมล
  addEmail() {
    this.emails.push(this.fb.group({
      type: ['home'], // ค่าเริ่มต้น
      value: ['', [Validators.required, Validators.email]]
    }));
  }

  removeEmail(index: number) { this.emails.removeAt(index); }

  // ฟังก์ชันเพิ่มฟิลด์เบอร์โทร
  addPhone() {
    this.phones.push(this.fb.group({
      type: ['mobile'], // ค่าเริ่มต้น
      value: ['', Validators.required]
    }));
  }

  removePhone(index: number) { this.phones.removeAt(index); }

  async onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const formValue = this.contactForm.value;
    
    // จัดรูปแบบข้อมูลให้ตรงกับที่ Google API ต้องการ
    const newContact: any = {
      names: [{
        givenName: formValue.givenName,
        familyName: formValue.familyName,
      }]
    };

    if (formValue.emails && formValue.emails.length > 0) {
      newContact.emailAddresses = formValue.emails.map((e: any) => ({
        value: e.value,
        type: e.type
      }));
    }

    if (formValue.phones && formValue.phones.length > 0) {
      newContact.phoneNumbers = formValue.phones.map((p: any) => ({
        value: p.value,
        type: p.type
      }));
    }

    try {
      await this.peopleService.createContact(newContact as Person);
      // บันทึกเสร็จแล้ว เด้งกลับไปหน้ารายชื่อ
      this.router.navigate(['/google/people']);
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  }

  cancel() {
    this.router.navigate(['/google/people']);
  }
}