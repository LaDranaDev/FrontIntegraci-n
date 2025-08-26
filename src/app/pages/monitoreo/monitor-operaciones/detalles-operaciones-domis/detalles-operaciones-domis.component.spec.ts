import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesDomisComponent } from './detalles-operaciones-domis.component';

describe('DetallesOperacionesDomisComponent', () => {
  let component: DetallesOperacionesDomisComponent;
  let fixture: ComponentFixture<DetallesOperacionesDomisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesDomisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesDomisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
