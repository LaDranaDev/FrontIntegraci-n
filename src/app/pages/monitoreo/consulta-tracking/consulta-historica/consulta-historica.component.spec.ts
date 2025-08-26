import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaHistoricaComponent } from './consulta-historica.component';

describe('ConsultaHistoricaComponent', () => {
  let component: ConsultaHistoricaComponent;
  let fixture: ComponentFixture<ConsultaHistoricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaHistoricaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaHistoricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
