import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContingenciaComponent } from './contingencia.component';

describe('ContingenciaComponent', () => {
  let component: ContingenciaComponent;
  let fixture: ComponentFixture<ContingenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContingenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContingenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
