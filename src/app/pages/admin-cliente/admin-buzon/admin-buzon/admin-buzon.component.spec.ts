import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBuzonComponent } from './admin-buzon.component';

describe('AdminBuzonComponent', () => {
  let component: AdminBuzonComponent;
  let fixture: ComponentFixture<AdminBuzonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBuzonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBuzonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
