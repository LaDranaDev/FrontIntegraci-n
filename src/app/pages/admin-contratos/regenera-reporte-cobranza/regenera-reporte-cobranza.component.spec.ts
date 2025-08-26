import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegeneraReporteCobranzaComponent } from './regenera-reporte-cobranza.component';

describe('RegeneraReporteCobranzaComponent', () => {
  let component: RegeneraReporteCobranzaComponent;
  let fixture: ComponentFixture<RegeneraReporteCobranzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegeneraReporteCobranzaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegeneraReporteCobranzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
