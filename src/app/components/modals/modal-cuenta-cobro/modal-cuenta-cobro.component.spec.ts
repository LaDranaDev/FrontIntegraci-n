import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCuentaCobroComponent } from './modal-cuenta-cobro.component';

describe('ModalCuentaCobroComponent', () => {
  let component: ModalCuentaCobroComponent;
  let fixture: ComponentFixture<ModalCuentaCobroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCuentaCobroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCuentaCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
