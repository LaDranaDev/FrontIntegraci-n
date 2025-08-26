import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCambioEstatusComponent } from './solicitud-cambio-estatus.component';

describe('SolicitudCambioEstatusComponent', () => {
  let component: SolicitudCambioEstatusComponent;
  let fixture: ComponentFixture<SolicitudCambioEstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudCambioEstatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudCambioEstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
