import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorOperacionesOnlineComponent } from './monitor-operaciones-online.component';

describe('MonitorOperacionesOnlineComponent', () => {
  let component: MonitorOperacionesOnlineComponent;
  let fixture: ComponentFixture<MonitorOperacionesOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorOperacionesOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorOperacionesOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
