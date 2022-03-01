import { TestBed } from '@angular/core/testing';

import { MoveSelectionService } from './move-selection.service';

describe('MoveSelectionService', () => {
  let service: MoveSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoveSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
