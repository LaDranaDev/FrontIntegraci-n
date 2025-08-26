import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficaArchivoClienteComponent } from './grafica-archivo-cliente.component';

describe('GraficaArchivoClienteComponent', () => {
  let component: GraficaArchivoClienteComponent;
  let fixture: ComponentFixture<GraficaArchivoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficaArchivoClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficaArchivoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
