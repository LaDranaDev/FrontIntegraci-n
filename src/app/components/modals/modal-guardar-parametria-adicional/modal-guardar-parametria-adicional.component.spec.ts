import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalGuardarParametriaAdicionalComponent } from './modal-guardar-parametria-adicional.component';

describe('ModalGuardarParametriaAdicionalComponent', () => {
  let component: ModalGuardarParametriaAdicionalComponent;
  let fixture: ComponentFixture<ModalGuardarParametriaAdicionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalGuardarParametriaAdicionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGuardarParametriaAdicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
