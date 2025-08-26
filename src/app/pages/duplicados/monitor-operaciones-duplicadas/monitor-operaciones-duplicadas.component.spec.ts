import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorOperacionesDuplicadasComponent } from './monitor-operaciones-duplicadas.component';

describe('MonitorOperacionesDuplicadasComponent', () => {
  let component: MonitorOperacionesDuplicadasComponent;
  let fixture: ComponentFixture<MonitorOperacionesDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorOperacionesDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorOperacionesDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
