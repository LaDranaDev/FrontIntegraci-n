import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarParametrosParaContratoComponent } from './modificar-parametros-para-contrato.component';

describe('ModificarParametrosParaContratoComponent', () => {
  let component: ModificarParametrosParaContratoComponent;
  let fixture: ComponentFixture<ModificarParametrosParaContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarParametrosParaContratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarParametrosParaContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
