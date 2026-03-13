import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarWarSettings } from './star-war-settings';

describe('StarWarSettings', () => {
  let component: StarWarSettings;
  let fixture: ComponentFixture<StarWarSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarWarSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarWarSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
