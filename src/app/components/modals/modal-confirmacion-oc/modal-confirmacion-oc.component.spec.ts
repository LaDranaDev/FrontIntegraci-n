import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmacionOCComponent } from './modal-confirmacion-oc.component';

describe('ModalConfirmacionOCComponent', () => {
  let component: ModalConfirmacionOCComponent;
  let fixture: ComponentFixture<ModalConfirmacionOCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConfirmacionOCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmacionOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
