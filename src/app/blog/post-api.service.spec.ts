import { TestBed } from '@angular/core/testing';

import { PostApiService } from './post-api.service';

describe('PostApiService', () => {
  let service: PostApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
