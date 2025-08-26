import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProductosConfirmingComponent } from './modal-productos-confirming.component';

describe('ModalProductosConfirmingComponent', () => {
  let component: ModalProductosConfirmingComponent;
  let fixture: ComponentFixture<ModalProductosConfirmingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalProductosConfirmingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProductosConfirmingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
