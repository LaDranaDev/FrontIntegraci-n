import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaContratosComponent } from './alta-contratos.component';

describe('AltaContratosComponent', () => {
  let component: AltaContratosComponent;
  let fixture: ComponentFixture<AltaContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaContratosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
