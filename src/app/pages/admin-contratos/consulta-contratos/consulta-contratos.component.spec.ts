import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaContratosComponent } from './consulta-contratos.component';

describe('ConsultaContratosComponent', () => {
  let component: ConsultaContratosComponent;
  let fixture: ComponentFixture<ConsultaContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaContratosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
