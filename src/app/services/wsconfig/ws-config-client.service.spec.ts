import { TestBed } from '@angular/core/testing';

import { WsConfigClientService } from './ws-config-client.service';

describe('WsConfigClientService', () => {
  let service: WsConfigClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WsConfigClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
