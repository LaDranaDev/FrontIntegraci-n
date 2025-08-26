import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMensajeErrorComponent } from './detalle-mensaje-error.component';

describe('DetalleMensajeErrorComponent', () => {
  let component: DetalleMensajeErrorComponent;
  let fixture: ComponentFixture<DetalleMensajeErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleMensajeErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleMensajeErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
