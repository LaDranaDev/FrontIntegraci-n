import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSeleccionarPaginaComponent } from './modal-seleccionar-pagina.component';

describe('ModalSeleccionarPaginaComponent', () => {
  let component: ModalSeleccionarPaginaComponent;
  let fixture: ComponentFixture<ModalSeleccionarPaginaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSeleccionarPaginaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSeleccionarPaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
