import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesTarjetasPropComponent } from './detalles-operaciones-tarjetas-prop.component';

describe('DetallesOperacionesTarjetasPropComponent', () => {
  let component: DetallesOperacionesTarjetasPropComponent;
  let fixture: ComponentFixture<DetallesOperacionesTarjetasPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesTarjetasPropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesTarjetasPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
