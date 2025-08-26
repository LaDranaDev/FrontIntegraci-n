import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelacionOperacionesComponent } from './cancelacion-operaciones.component';

describe('CancelacionOperacionesComponent', () => {
  let component: CancelacionOperacionesComponent;
  let fixture: ComponentFixture<CancelacionOperacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelacionOperacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelacionOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
