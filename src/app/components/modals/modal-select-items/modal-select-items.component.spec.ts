import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelectItemsComponent } from './modal-select-items.component';

describe('ModalSelectItemsComponent', () => {
  let component: ModalSelectItemsComponent;
  let fixture: ComponentFixture<ModalSelectItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSelectItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSelectItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
