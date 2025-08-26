import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPaisesComponent } from './gestion-paises.component';

describe('GestionPaisesComponent', () => {
  let component: GestionPaisesComponent;
  let fixture: ComponentFixture<GestionPaisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPaisesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPaisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
