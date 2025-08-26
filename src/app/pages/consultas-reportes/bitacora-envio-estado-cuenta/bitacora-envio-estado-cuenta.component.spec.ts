import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacoraEnvioEstadoCuentaComponent } from './bitacora-envio-estado-cuenta.component';

describe('BitacoraEnvioEstadoCuentaComponent', () => {
  let component: BitacoraEnvioEstadoCuentaComponent;
  let fixture: ComponentFixture<BitacoraEnvioEstadoCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitacoraEnvioEstadoCuentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitacoraEnvioEstadoCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
