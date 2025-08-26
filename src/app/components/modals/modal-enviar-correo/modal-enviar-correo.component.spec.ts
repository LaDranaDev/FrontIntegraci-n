import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEnviarCorreoComponent } from './modal-enviar-correo.component';

describe('ModalEnviarCorreoComponent', () => {
  let component: ModalEnviarCorreoComponent;
  let fixture: ComponentFixture<ModalEnviarCorreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEnviarCorreoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEnviarCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
