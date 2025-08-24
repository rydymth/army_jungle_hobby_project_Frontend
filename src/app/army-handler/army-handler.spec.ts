import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmyHandler } from './army-handler';

describe('ArmyHandler', () => {
  let component: ArmyHandler;
  let fixture: ComponentFixture<ArmyHandler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmyHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmyHandler);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
