import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesOrdenPagoATMComponent } from './detalles-operaciones-orden-pago-atm.component';

describe('DetallesOperacionesOrdenPagoATMComponent', () => {
  let component: DetallesOperacionesOrdenPagoATMComponent;
  let fixture: ComponentFixture<DetallesOperacionesOrdenPagoATMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesOrdenPagoATMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesOrdenPagoATMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
