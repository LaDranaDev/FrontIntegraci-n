import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidadoHistoricoLayoutComponent } from './consolidado-historico-layout.component';

describe('ConsolidadoHistoricoLayoutComponent', () => {
  let component: ConsolidadoHistoricoLayoutComponent;
  let fixture: ComponentFixture<ConsolidadoHistoricoLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsolidadoHistoricoLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidadoHistoricoLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
