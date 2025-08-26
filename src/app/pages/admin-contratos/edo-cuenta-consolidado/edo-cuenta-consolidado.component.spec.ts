import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdoCuentaConsolidadoComponent } from './edo-cuenta-consolidado.component';

describe('EdoCuentaConsolidadoComponent', () => {
  let component: EdoCuentaConsolidadoComponent;
  let fixture: ComponentFixture<EdoCuentaConsolidadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdoCuentaConsolidadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdoCuentaConsolidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
