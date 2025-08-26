import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionAnularComisionComponent } from './confirmacion-anular-comision.component';

describe('ConfirmacionAnularComisionComponent', () => {
  let component: ConfirmacionAnularComisionComponent;
  let fixture: ComponentFixture<ConfirmacionAnularComisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacionAnularComisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacionAnularComisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
