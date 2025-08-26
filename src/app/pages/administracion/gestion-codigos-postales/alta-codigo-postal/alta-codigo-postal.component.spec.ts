import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaCodigoPostalComponent } from './alta-codigo-postal.component';

describe('AltaCodigoPostalComponent', () => {
  let component: AltaCodigoPostalComponent;
  let fixture: ComponentFixture<AltaCodigoPostalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaCodigoPostalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaCodigoPostalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
