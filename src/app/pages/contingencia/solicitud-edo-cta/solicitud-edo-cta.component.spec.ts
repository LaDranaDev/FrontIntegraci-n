import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudEdoCtaComponent } from './solicitud-edo-cta.component';

describe('SolicitudEdoCtaComponent', () => {
  let component: SolicitudEdoCtaComponent;
  let fixture: ComponentFixture<SolicitudEdoCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudEdoCtaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudEdoCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
