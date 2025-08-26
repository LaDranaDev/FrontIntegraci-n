import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddClienteComponent } from './modal-add-cliente.component';

describe('ModalAddClienteComponent', () => {
  let component: ModalAddClienteComponent;
  let fixture: ComponentFixture<ModalAddClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
