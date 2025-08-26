import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLayoutsComponent } from './gestion-layouts.component';

describe('GestionLayoutsComponent', () => {
  let component: GestionLayoutsComponent;
  let fixture: ComponentFixture<GestionLayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionLayoutsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionLayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
