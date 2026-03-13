import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningCrawl } from './opening-crawl';

describe('OpeningCrawl', () => {
  let component: OpeningCrawl;
  let fixture: ComponentFixture<OpeningCrawl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpeningCrawl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpeningCrawl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
