import { TestBed } from '@angular/core/testing';

import { AngularQueryService } from './angular-query.service';

describe('AngularQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularQueryService = TestBed.get(AngularQueryService);
    expect(service).toBeTruthy();
  });
});
