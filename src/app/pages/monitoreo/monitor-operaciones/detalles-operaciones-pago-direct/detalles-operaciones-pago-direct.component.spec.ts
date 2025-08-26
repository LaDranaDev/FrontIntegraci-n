import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesPagoDirectComponent } from './detalles-operaciones-pago-direct.component';

describe('DetallesOperacionesPagoDirectComponent', () => {
  let component: DetallesOperacionesPagoDirectComponent;
  let fixture: ComponentFixture<DetallesOperacionesPagoDirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesPagoDirectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesPagoDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
