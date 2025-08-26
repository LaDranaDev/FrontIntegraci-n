import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesPIFDuplicadasComponent } from './detalles-pif-duplicadas.component';

describe('DetallesPIFDuplicadasComponent', () => {
  let component: DetallesPIFDuplicadasComponent;
  let fixture: ComponentFixture<DetallesPIFDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesPIFDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesPIFDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
