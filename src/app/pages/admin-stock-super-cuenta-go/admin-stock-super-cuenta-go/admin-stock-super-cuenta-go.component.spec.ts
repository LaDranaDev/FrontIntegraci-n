import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStockSuperCuentaGoComponent } from './admin-stock-super-cuenta-go.component';

describe('AdminStockSuperCuentaGoComponent', () => {
  let component: AdminStockSuperCuentaGoComponent;
  let fixture: ComponentFixture<AdminStockSuperCuentaGoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminStockSuperCuentaGoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStockSuperCuentaGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
