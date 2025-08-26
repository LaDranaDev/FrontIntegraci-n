import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmacionYNComponent } from './modal-confirmacion-y-n.component';

describe('ModalConfirmacionYNComponent', () => {
  let component: ModalConfirmacionYNComponent;
  let fixture: ComponentFixture<ModalConfirmacionYNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConfirmacionYNComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmacionYNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
