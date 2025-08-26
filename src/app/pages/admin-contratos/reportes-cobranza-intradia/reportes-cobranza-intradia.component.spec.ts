import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesCobranzaIntradiaComponent } from './reportes-cobranza-intradia.component';

describe('ReportesCobranzaIntradiaComponent', () => {
  let component: ReportesCobranzaIntradiaComponent;
  let fixture: ComponentFixture<ReportesCobranzaIntradiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesCobranzaIntradiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesCobranzaIntradiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
