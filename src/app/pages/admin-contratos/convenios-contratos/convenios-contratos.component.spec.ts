import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConveniosContratosComponent } from './convenios-contratos.component';

describe('ConveniosContratosComponent', () => {
  let component: ConveniosContratosComponent;
  let fixture: ComponentFixture<ConveniosContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConveniosContratosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConveniosContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
