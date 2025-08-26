import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierreProductosComponent } from './cierre-productos.component';

describe('CierreProductosComponent', () => {
  let component: CierreProductosComponent;
  let fixture: ComponentFixture<CierreProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CierreProductosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CierreProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
