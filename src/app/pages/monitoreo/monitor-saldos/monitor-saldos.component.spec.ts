import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorSaldosComponent } from './monitor-saldos.component';

describe('MonitorSaldosComponent', () => {
  let component: MonitorSaldosComponent;
  let fixture: ComponentFixture<MonitorSaldosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorSaldosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorSaldosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
