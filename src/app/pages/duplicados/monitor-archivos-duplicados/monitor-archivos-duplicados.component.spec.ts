import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorArchivosDuplicadosComponent } from './monitor-archivos-duplicados.component';

describe('MonitorArchivosDuplicadosComponent', () => {
  let component: MonitorArchivosDuplicadosComponent;
  let fixture: ComponentFixture<MonitorArchivosDuplicadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorArchivosDuplicadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorArchivosDuplicadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
