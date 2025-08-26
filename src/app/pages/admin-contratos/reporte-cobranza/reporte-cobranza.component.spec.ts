import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCobranzaComponent } from './reporte-cobranza.component';

describe('ReporteCobranzaComponent', () => {
  let component: ReporteCobranzaComponent;
  let fixture: ComponentFixture<ReporteCobranzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCobranzaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCobranzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
