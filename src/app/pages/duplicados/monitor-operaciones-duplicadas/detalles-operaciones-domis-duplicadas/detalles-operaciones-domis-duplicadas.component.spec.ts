import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesDomisDuplicadasComponent } from './detalles-operaciones-domis-duplicadas.component';

describe('DetallesOperacionesDomisDuplicadasComponent', () => {
  let component: DetallesOperacionesDomisDuplicadasComponent;
  let fixture: ComponentFixture<DetallesOperacionesDomisDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesDomisDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesDomisDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
