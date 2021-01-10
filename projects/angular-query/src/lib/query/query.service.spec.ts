import { TestBed } from '@angular/core/testing';
import { QueryService } from './query.service';

describe('QueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryService = TestBed.inject(QueryService);
    expect(service).toBeTruthy();
  });
});
