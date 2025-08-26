import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorDemandaComponent } from './por-demanda.component';

describe('PorDemandaComponent', () => {
  let component: PorDemandaComponent;
  let fixture: ComponentFixture<PorDemandaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PorDemandaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PorDemandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
