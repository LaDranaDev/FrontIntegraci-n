import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesAltaMasivaDuplicadasComponent } from './detalles-operaciones-alta-masiva-duplicadas.component';

describe('DetallesOperacionesAltaMasivaDuplicadasComponent', () => {
  let component: DetallesOperacionesAltaMasivaDuplicadasComponent;
  let fixture: ComponentFixture<DetallesOperacionesAltaMasivaDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesAltaMasivaDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesAltaMasivaDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
