import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorizacionComponent } from './monitorizacion.component';

describe('MonitorizacionComponent', () => {
  let component: MonitorizacionComponent;
  let fixture: ComponentFixture<MonitorizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
