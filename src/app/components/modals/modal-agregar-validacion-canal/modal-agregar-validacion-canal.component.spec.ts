import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarValidacionCanalComponent } from './modal-agregar-validacion-canal.component';

describe('ModalAgregarValidacionCanalComponent', () => {
  let component: ModalAgregarValidacionCanalComponent;
  let fixture: ComponentFixture<ModalAgregarValidacionCanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAgregarValidacionCanalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarValidacionCanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
