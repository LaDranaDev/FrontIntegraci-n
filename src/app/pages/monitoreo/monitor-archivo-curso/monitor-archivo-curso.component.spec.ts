import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorArchivoCursoComponent } from './monitor-archivo-curso.component';

describe('MonitorArchivoCursoComponent', () => {
  let component: MonitorArchivoCursoComponent;
  let fixture: ComponentFixture<MonitorArchivoCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorArchivoCursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorArchivoCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
