import { TestBed } from '@angular/core/testing';

import { RayCasterTs } from './ray-caster.ts';

describe('RayCasterTs', () => {
  let service: RayCasterTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RayCasterTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
