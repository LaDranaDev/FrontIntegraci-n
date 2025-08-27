import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaTrackingApiComponent } from './consulta-tracking-api.component';

describe('ConsultaTrackingApiComponent', () => {
  let component: ConsultaTrackingApiComponent;
  let fixture: ComponentFixture<ConsultaTrackingApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaTrackingApiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaTrackingApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
