import { TestBed } from '@angular/core/testing';

import { CollabSelectionService } from './collab-selection.service';

describe('CollabSelectionService', () => {
  let service: CollabSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollabSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
