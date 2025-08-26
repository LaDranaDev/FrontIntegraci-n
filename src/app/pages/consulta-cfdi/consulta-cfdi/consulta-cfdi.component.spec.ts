import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCfdiComponent } from './consulta-cfdi.component';

describe('ConsultaCfdiComponent', () => {
  let component: ConsultaCfdiComponent;
  let fixture: ComponentFixture<ConsultaCfdiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaCfdiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaCfdiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
