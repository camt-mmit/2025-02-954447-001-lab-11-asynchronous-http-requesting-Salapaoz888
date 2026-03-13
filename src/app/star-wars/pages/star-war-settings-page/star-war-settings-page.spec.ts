import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarWarSettingsPage } from './star-war-settings-page';

describe('StarWarSettingsPage', () => {
  let component: StarWarSettingsPage;
  let fixture: ComponentFixture<StarWarSettingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarWarSettingsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarWarSettingsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
