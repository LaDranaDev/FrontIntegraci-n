import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarValidacionComponent } from './agregar-validacion.component';

describe('AgregarValidacionComponent', () => {
  let component: AgregarValidacionComponent;
  let fixture: ComponentFixture<AgregarValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarValidacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
