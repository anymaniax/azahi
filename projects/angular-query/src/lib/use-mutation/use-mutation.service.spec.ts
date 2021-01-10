import { TestBed } from '@angular/core/testing';
import { UseMutationService } from './use-mutation.service';

describe('AngularUseMutationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UseMutationService = TestBed.inject(UseMutationService);
    expect(service).toBeTruthy();
  });
});
