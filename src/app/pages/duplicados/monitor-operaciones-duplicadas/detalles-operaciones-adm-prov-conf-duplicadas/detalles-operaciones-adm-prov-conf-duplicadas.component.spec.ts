import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesAdmProvConfDuplicadasComponent } from './detalles-operaciones-adm-prov-conf-duplicadas.component';

describe('DetallesOperacionesAdmProvConfDuplicadasComponent', () => {
  let component: DetallesOperacionesAdmProvConfDuplicadasComponent;
  let fixture: ComponentFixture<DetallesOperacionesAdmProvConfDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesAdmProvConfDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesAdmProvConfDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
