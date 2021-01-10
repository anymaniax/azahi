import { TestBed } from '@angular/core/testing';

import { BaseQueryService } from './base-query.service';

describe('BaseQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseQueryService = TestBed.inject(BaseQueryService);
    expect(service).toBeTruthy();
  });
});
