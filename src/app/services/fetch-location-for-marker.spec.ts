import { TestBed } from '@angular/core/testing';

import { FetchLocationForMarker } from './fetch-location-for-marker';

describe('FetchLocationForMarker', () => {
  let service: FetchLocationForMarker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchLocationForMarker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
