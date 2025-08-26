import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarParametrosParaContratoComponent } from './configurar-parametros-para-contrato.component';

describe('ConfigurarParametrosParaContratoComponent', () => {
  let component: ConfigurarParametrosParaContratoComponent;
  let fixture: ComponentFixture<ConfigurarParametrosParaContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurarParametrosParaContratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurarParametrosParaContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
