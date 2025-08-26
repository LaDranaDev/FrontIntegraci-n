import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionBackendsComponent } from './gestion-backends.component';

describe('GestionBackendsComponent', () => {
  let component: GestionBackendsComponent;
  let fixture: ComponentFixture<GestionBackendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionBackendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionBackendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
