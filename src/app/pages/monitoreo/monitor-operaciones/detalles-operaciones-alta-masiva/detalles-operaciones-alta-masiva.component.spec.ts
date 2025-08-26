import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesAltaMasivaComponent } from './detalles-operaciones-alta-masiva.component';

describe('DetallesOperacionesAltaMasivaComponent', () => {
  let component: DetallesOperacionesAltaMasivaComponent;
  let fixture: ComponentFixture<DetallesOperacionesAltaMasivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesAltaMasivaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesAltaMasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
