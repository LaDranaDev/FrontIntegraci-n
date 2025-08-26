import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesSPIDComponent } from './detalles-operaciones-spid.component';

describe('DetallesOperacionesSPIDComponent', () => {
  let component: DetallesOperacionesSPIDComponent;
  let fixture: ComponentFixture<DetallesOperacionesSPIDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesSPIDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesSPIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
