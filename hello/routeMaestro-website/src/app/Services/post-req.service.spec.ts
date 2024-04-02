import { TestBed } from '@angular/core/testing';

import { PostReqService } from './post-req.service';

describe('PostReqService', () => {
  let service: PostReqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostReqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
