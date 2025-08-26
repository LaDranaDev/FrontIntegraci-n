import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaProductoComponent } from './cuenta-producto.component';

describe('CuentaProductoComponent', () => {
  let component: CuentaProductoComponent;
  let fixture: ComponentFixture<CuentaProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
