import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionCertificadosComponent } from './administracion-certificados.component';

describe('AdministracionCertificadosComponent', () => {
  let component: AdministracionCertificadosComponent;
  let fixture: ComponentFixture<AdministracionCertificadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionCertificadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministracionCertificadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
