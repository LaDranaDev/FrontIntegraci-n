import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalGuardarParametriaAdicionalDosComponent } from './modal-guardar-parametria-adicional-dos.component';

describe('ModalGuardarParametriaAdicionalDosComponent', () => {
  let component: ModalGuardarParametriaAdicionalDosComponent;
  let fixture: ComponentFixture<ModalGuardarParametriaAdicionalDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalGuardarParametriaAdicionalDosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGuardarParametriaAdicionalDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
