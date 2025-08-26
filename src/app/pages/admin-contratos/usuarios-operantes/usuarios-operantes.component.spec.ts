import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosOperantesComponent } from './usuarios-operantes.component';

describe('UsuariosOperantesComponent', () => {
  let component: UsuariosOperantesComponent;
  let fixture: ComponentFixture<UsuariosOperantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosOperantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosOperantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
