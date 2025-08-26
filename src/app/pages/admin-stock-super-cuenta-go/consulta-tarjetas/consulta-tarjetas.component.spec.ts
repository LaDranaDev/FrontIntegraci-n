import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaTarjetasComponent } from './consulta-tarjetas.component';

describe('ConsultaTarjetasComponent', () => {
  let component: ConsultaTarjetasComponent;
  let fixture: ComponentFixture<ConsultaTarjetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaTarjetasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaTarjetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
