import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSolicitudCambioEstatusComponent } from './modal-solicitud-cambio-estatus.component';

describe('ModalSolicitudCambioEstatusComponent', () => {
  let component: ModalSolicitudCambioEstatusComponent;
  let fixture: ComponentFixture<ModalSolicitudCambioEstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSolicitudCambioEstatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSolicitudCambioEstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
