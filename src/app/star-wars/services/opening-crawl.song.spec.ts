import { TestBed } from '@angular/core/testing';

import { OpeningCrawlSong } from './opening-crawl.song';

describe('OpeningCrawlSong', () => {
  let service: OpeningCrawlSong;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpeningCrawlSong);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
