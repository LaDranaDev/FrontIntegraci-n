import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosDelContratoComponent } from './parametros-del-contrato.component';

describe('ParametrosDelContratoComponent', () => {
  let component: ParametrosDelContratoComponent;
  let fixture: ComponentFixture<ParametrosDelContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametrosDelContratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosDelContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
