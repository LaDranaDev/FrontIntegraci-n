import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaPagadoraComponent } from './cuenta-pagadora.component';

describe('CuentaPagadoraComponent', () => {
  let component: CuentaPagadoraComponent;
  let fixture: ComponentFixture<CuentaPagadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaPagadoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaPagadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
