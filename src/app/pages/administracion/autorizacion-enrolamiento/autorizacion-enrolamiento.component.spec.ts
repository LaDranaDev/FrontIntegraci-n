import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacionEnrolamientoComponent } from './autorizacion-enrolamiento.component';

describe('AutorizacionEnrolamientoComponent', () => {
  let component: AutorizacionEnrolamientoComponent;
  let fixture: ComponentFixture<AutorizacionEnrolamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutorizacionEnrolamientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutorizacionEnrolamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
