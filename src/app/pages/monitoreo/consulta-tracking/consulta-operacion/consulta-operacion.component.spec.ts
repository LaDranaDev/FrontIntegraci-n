import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaOperacionComponent } from './consulta-operacion.component';

describe('ConsultaOperacionComponent', () => {
  let component: ConsultaOperacionComponent;
  let fixture: ComponentFixture<ConsultaOperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaOperacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaOperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
