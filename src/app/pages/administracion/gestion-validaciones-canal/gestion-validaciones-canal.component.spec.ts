import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionValidacionesCanalComponent } from './gestion-validaciones-canal.component';

describe('GestionValidacionesCanalComponent', () => {
  let component: GestionValidacionesCanalComponent;
  let fixture: ComponentFixture<GestionValidacionesCanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionValidacionesCanalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionValidacionesCanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
