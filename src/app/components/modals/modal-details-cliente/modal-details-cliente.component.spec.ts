import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailsClienteComponent } from './modal-details-cliente.component';

describe('ModalDetailsClienteComponent', () => {
  let component: ModalDetailsClienteComponent;
  let fixture: ComponentFixture<ModalDetailsClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetailsClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailsClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
