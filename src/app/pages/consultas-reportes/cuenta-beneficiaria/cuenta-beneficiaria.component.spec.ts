import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaBeneficiariaComponent } from './cuenta-beneficiaria.component';

describe('CuentaBeneficiariaComponent', () => {
  let component: CuentaBeneficiariaComponent;
  let fixture: ComponentFixture<CuentaBeneficiariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaBeneficiariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaBeneficiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
