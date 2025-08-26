import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesSPIDDuplicadasComponent } from './detalles-operaciones-spid-duplicadas.component';

describe('DetallesOperacionesSPIDDuplicadasComponent', () => {
  let component: DetallesOperacionesSPIDDuplicadasComponent;
  let fixture: ComponentFixture<DetallesOperacionesSPIDDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesSPIDDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesSPIDDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
