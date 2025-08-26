import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesOrdenPagoComponent } from './detalles-operaciones-orden-pago.component';

describe('DetallesOperacionesOrdenPagoComponent', () => {
  let component: DetallesOperacionesOrdenPagoComponent;
  let fixture: ComponentFixture<DetallesOperacionesOrdenPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesOrdenPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesOrdenPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
