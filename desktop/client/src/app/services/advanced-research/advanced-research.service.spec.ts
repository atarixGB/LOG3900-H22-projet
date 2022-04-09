import { TestBed } from '@angular/core/testing';

import { AdvancedResearchService } from './advanced-research.service';

describe('AdvancedResearchService', () => {
  let service: AdvancedResearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvancedResearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
