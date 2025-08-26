import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalOperacionesProductoComponent } from './total-operaciones-producto.component';

describe('TotalOperacionesProductoComponent', () => {
  let component: TotalOperacionesProductoComponent;
  let fixture: ComponentFixture<TotalOperacionesProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalOperacionesProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalOperacionesProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
