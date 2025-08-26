import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesDuplicadasComponent } from './detalles-operaciones-duplicadas.component';

describe('DetallesOperacionesDuplicadasComponent', () => {
  let component: DetallesOperacionesDuplicadasComponent;
  let fixture: ComponentFixture<DetallesOperacionesDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
