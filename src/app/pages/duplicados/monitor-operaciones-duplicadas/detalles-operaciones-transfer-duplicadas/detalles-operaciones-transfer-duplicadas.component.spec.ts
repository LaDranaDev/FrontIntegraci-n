import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesTransferDuplicadasComponent } from './detalles-operaciones-transfer-duplicadas.component';

describe('DetallesOperacionesTransferDuplicadasComponent', () => {
  let component: DetallesOperacionesTransferDuplicadasComponent;
  let fixture: ComponentFixture<DetallesOperacionesTransferDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesTransferDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesTransferDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
