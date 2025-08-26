import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoDirectoComponent } from './pago-directo.component';

describe('PagoDirectoComponent', () => {
  let component: PagoDirectoComponent;
  let fixture: ComponentFixture<PagoDirectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoDirectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoDirectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
