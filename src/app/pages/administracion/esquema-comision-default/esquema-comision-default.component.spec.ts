import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsquemaComisionDefaultComponent } from './esquema-comision-default.component';

describe('EsquemaComisionDefaultComponent', () => {
  let component: EsquemaComisionDefaultComponent;
  let fixture: ComponentFixture<EsquemaComisionDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsquemaComisionDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsquemaComisionDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
