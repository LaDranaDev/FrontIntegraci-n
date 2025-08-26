import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobroComisionComponent } from './cobro-comision.component';

describe('CobroComisionComponent', () => {
  let component: CobroComisionComponent;
  let fixture: ComponentFixture<CobroComisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CobroComisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CobroComisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
