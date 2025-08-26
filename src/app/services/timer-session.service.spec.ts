import { TestBed } from '@angular/core/testing';

import { TimerSessionService } from './timer-session.service';

describe('TimerSessionService', () => {
  let service: TimerSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});