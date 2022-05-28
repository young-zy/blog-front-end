import { TestBed } from '@angular/core/testing';

import { TocServiceService } from './toc-service.service';

describe('TocServiceService', () => {
  let service: TocServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TocServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
