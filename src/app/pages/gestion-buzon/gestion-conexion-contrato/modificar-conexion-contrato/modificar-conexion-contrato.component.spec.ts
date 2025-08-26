import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarConexionContratoComponent } from './modificar-conexion-contrato.component';

describe('ModificarConexionContratoComponent', () => {
  let component: ModificarConexionContratoComponent;
  let fixture: ComponentFixture<ModificarConexionContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarConexionContratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarConexionContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
