import { TestBed } from '@angular/core/testing';

import { UseBaseQueryService } from './use-base-query.service';

describe('AngularUseBaseQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UseBaseQueryService = TestBed.inject(UseBaseQueryService);
    expect(service).toBeTruthy();
  });
});
