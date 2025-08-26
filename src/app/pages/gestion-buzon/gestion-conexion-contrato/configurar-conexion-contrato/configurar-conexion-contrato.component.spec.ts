import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarConexionContratoComponent } from './configurar-conexion-contrato.component';

describe('ConfigurarConexionContratoComponent', () => {
  let component: ConfigurarConexionContratoComponent;
  let fixture: ComponentFixture<ConfigurarConexionContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurarConexionContratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurarConexionContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
