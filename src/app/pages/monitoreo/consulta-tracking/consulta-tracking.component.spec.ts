import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaTrackingComponent } from './consulta-tracking.component';

describe('ConsultaTrackingComponent', () => {
  let component: ConsultaTrackingComponent;
  let fixture: ComponentFixture<ConsultaTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
