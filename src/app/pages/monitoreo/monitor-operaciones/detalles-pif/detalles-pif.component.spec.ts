import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesPIFComponent } from './detalles-pif.component';

describe('DetallesPIFComponent', () => {
  let component: DetallesPIFComponent;
  let fixture: ComponentFixture<DetallesPIFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesPIFComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesPIFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
