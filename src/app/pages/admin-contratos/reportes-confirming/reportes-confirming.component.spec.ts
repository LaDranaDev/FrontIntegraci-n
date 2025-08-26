import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesConfirmingComponent } from './reportes-confirming.component';

describe('ReportesConfirmingComponent', () => {
  let component: ReportesConfirmingComponent;
  let fixture: ComponentFixture<ReportesConfirmingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesConfirmingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesConfirmingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
