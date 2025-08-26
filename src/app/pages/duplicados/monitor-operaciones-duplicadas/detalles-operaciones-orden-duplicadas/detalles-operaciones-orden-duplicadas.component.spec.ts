import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesOrdenDuplicadasComponent } from './detalles-operaciones-orden-duplicadas.component';

describe('DetallesOperacionesOrdenDuplicadasComponent', () => {
  let component: DetallesOperacionesOrdenDuplicadasComponent;
  let fixture: ComponentFixture<DetallesOperacionesOrdenDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesOrdenDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesOrdenDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
