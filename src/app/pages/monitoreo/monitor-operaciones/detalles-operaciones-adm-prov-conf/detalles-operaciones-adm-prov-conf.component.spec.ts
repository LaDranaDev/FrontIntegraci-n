import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesAdmProvConfComponent } from './detalles-operaciones-adm-prov-conf.component';

describe('DetallesOperacionesAdmProvConfComponent', () => {
  let component: DetallesOperacionesAdmProvConfComponent;
  let fixture: ComponentFixture<DetallesOperacionesAdmProvConfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesAdmProvConfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesAdmProvConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
