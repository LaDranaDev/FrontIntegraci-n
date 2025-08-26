import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaPistasAuditoriaComponent } from './consulta-pistas-auditoria.component';

describe('ConsultaPistasAuditoriaComponent', () => {
  let component: ConsultaPistasAuditoriaComponent;
  let fixture: ComponentFixture<ConsultaPistasAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaPistasAuditoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaPistasAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
