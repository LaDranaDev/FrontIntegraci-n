import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosConsultasComponent } from './filtros-consultas.component';

describe('FiltrosConsultasComponent', () => {
  let component: FiltrosConsultasComponent;
  let fixture: ComponentFixture<FiltrosConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltrosConsultasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
