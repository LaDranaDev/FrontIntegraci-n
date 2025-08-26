import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAnualBuzonComponent } from './historial-anual-buzon.component';

describe('HistorialAnualBuzonComponent', () => {
  let component: HistorialAnualBuzonComponent;
  let fixture: ComponentFixture<HistorialAnualBuzonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialAnualBuzonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialAnualBuzonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
