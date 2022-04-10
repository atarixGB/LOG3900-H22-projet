import { TestBed } from '@angular/core/testing';

import { CollabChatService } from './collab-chat.service';

describe('CollabChatService', () => {
  let service: CollabChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollabChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
