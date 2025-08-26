import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaBicComponent } from './consulta-bic.component';

describe('ConsultaBicComponent', () => {
  let component: ConsultaBicComponent;
  let fixture: ComponentFixture<ConsultaBicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaBicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaBicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
