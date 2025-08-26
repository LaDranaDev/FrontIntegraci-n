import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesComponent } from './detalles-operaciones.component';

describe('DetallesOperacionesComponent', () => {
  let component: DetallesOperacionesComponent;
  let fixture: ComponentFixture<DetallesOperacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
