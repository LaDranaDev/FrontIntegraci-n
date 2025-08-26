import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesPagImpAduaDuplicadasComponent } from './detalles-operaciones-pag-imp-adua-duplicadas.component';

describe('DetallesOperacionesPagImpAduaDuplicadasComponent', () => {
  let component: DetallesOperacionesPagImpAduaDuplicadasComponent;
  let fixture: ComponentFixture<DetallesOperacionesPagImpAduaDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesPagImpAduaDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesPagImpAduaDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
