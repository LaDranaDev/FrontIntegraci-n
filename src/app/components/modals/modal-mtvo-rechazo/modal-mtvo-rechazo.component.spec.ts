import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMtvoRechazoComponent } from './modal-mtvo-rechazo.component';

describe('ModalEnviarCorreoComponent', () => {
  let component: ModalMtvoRechazoComponent;
  let fixture: ComponentFixture<ModalMtvoRechazoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMtvoRechazoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMtvoRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
