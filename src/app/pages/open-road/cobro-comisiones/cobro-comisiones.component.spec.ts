import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobroComisionesComponent } from './cobro-comisiones.component';

describe('CobroComisionesComponent', () => {
  let component: CobroComisionesComponent;
  let fixture: ComponentFixture<CobroComisionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CobroComisionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CobroComisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
