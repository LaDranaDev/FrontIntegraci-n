import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditClienteComponent } from './modal-edit-cliente.component';

describe('ModalEditClienteComponent', () => {
  let component: ModalEditClienteComponent;
  let fixture: ComponentFixture<ModalEditClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEditClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
