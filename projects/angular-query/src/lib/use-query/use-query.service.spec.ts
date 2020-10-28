import { TestBed } from '@angular/core/testing';
import { UseQueryService } from './use-query.service';

describe('AngularUseQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UseQueryService = TestBed.inject(UseQueryService);
    expect(service).toBeTruthy();
  });
});
