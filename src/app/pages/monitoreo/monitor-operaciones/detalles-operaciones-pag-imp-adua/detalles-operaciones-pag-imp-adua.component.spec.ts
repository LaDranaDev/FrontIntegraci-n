import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesPagImpAduaComponent } from './detalles-operaciones-pag-imp-adua.component';

describe('DetallesOperacionesPagImpAduaComponent', () => {
  let component: DetallesOperacionesPagImpAduaComponent;
  let fixture: ComponentFixture<DetallesOperacionesPagImpAduaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesPagImpAduaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesPagImpAduaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
