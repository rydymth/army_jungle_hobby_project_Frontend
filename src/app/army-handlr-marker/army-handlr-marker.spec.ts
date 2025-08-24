import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmyHandlrMarker } from './army-handlr-marker';

describe('ArmyHandlrMarker', () => {
  let component: ArmyHandlrMarker;
  let fixture: ComponentFixture<ArmyHandlrMarker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmyHandlrMarker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmyHandlrMarker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
