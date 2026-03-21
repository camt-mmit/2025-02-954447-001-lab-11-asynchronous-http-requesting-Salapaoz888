import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContactPage } from './create-contact-page';

describe('CreateContactPage', () => {
  let component: CreateContactPage;
  let fixture: ComponentFixture<CreateContactPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateContactPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateContactPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
