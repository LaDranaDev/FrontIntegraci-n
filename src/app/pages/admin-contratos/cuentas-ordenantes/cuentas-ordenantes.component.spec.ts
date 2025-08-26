import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasOrdenantesComponent } from './cuentas-ordenantes.component';

describe('CuentasOrdenantesComponent', () => {
  let component: CuentasOrdenantesComponent;
  let fixture: ComponentFixture<CuentasOrdenantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentasOrdenantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentasOrdenantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
