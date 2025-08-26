import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMensajesErrorComponent } from './gestion-mensajes-error.component';

describe('GestionMensajesErrorComponent', () => {
  let component: GestionMensajesErrorComponent;
  let fixture: ComponentFixture<GestionMensajesErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionMensajesErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionMensajesErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
