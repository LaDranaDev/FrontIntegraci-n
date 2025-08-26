import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionConexionContratoComponent } from './gestion-conexion-contrato.component';

describe('GestionConexionContratoComponent', () => {
  let component: GestionConexionContratoComponent;
  let fixture: ComponentFixture<GestionConexionContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionConexionContratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionConexionContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
