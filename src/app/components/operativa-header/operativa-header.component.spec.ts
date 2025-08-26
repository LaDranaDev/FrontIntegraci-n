import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperativaHeaderComponent } from './operativa-header.component';

describe('OperativaHeaderComponent', () => {
  let component: OperativaHeaderComponent;
  let fixture: ComponentFixture<OperativaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperativaHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperativaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
