import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesTransferComponent } from './detalles-operaciones-transfer.component';

describe('DetallesOperacionesTransferComponent', () => {
  let component: DetallesOperacionesTransferComponent;
  let fixture: ComponentFixture<DetallesOperacionesTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
