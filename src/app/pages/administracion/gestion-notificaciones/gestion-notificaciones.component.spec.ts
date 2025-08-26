import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionNotificacionesComponent } from './gestion-notificaciones.component';

describe('GestionNotificacionesComponent', () => {
  let component: GestionNotificacionesComponent;
  let fixture: ComponentFixture<GestionNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionNotificacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
