import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCuentasBeneficiariasComponent } from './modal-cuentas-beneficiarias.component';

describe('ModalCuentasBeneficiariasComponent', () => {
  let component: ModalCuentasBeneficiariasComponent;
  let fixture: ComponentFixture<ModalCuentasBeneficiariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCuentasBeneficiariasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCuentasBeneficiariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
