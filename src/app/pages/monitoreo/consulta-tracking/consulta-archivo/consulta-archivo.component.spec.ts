import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaArchivoComponent } from './consulta-archivo.component';

describe('ConsultaArchivoComponent', () => {
  let component: ConsultaArchivoComponent;
  let fixture: ComponentFixture<ConsultaArchivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaArchivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
