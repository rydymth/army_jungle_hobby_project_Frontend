import { TestBed } from '@angular/core/testing';

import { FetchDeviceLocationTs } from './fetch-device-location.ts';

describe('FetchDeviceLocationTs', () => {
  let service: FetchDeviceLocationTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchDeviceLocationTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
