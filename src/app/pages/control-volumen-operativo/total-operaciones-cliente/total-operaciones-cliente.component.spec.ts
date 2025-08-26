import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalOperacionesClienteComponent } from './total-operaciones-cliente.component';

describe('TotalOperacionesClienteComponent', () => {
  let component: TotalOperacionesClienteComponent;
  let fixture: ComponentFixture<TotalOperacionesClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalOperacionesClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalOperacionesClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
