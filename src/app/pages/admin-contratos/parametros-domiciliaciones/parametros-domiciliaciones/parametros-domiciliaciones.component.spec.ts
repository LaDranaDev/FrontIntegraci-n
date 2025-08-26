import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosDomiciliacionesComponent } from './parametros-domiciliaciones.component';

describe('ParametrosDomiciliacionesComponent', () => {
  let component: ParametrosDomiciliacionesComponent;
  let fixture: ComponentFixture<ParametrosDomiciliacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametrosDomiciliacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametrosDomiciliacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
