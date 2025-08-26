import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCodigosPostalesComponent } from './gestion-codigos-postales.component';

describe('GestionCodigosPostalesComponent', () => {
  let component: GestionCodigosPostalesComponent;
  let fixture: ComponentFixture<GestionCodigosPostalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionCodigosPostalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCodigosPostalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
