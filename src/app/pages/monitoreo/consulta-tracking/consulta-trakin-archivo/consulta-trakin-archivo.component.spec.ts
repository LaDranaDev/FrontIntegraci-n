import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaTrakinArchivoComponent } from './consulta-trakin-archivo.component';

describe('ConsultaTrakinArchivoComponent', () => {
  let component: ConsultaTrakinArchivoComponent;
  let fixture: ComponentFixture<ConsultaTrakinArchivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaTrakinArchivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaTrakinArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
