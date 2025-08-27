import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoOperacionesComponent } from './monitoreo-operaciones.component';

describe('MonitoreoOperacionesComponent', () => {
  let component: MonitoreoOperacionesComponent;
  let fixture: ComponentFixture<MonitoreoOperacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoreoOperacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoreoOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
