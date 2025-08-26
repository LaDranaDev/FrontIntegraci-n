import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComprobanteComponent } from './modal-comprobante.component';

describe('ModalComprobanteComponent', () => {
  let component: ModalComprobanteComponent;
  let fixture: ComponentFixture<ModalComprobanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalComprobanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComprobanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
