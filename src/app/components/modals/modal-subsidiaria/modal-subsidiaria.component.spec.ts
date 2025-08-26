import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSubsidiariaComponent } from './modal-subsidiaria.component';

describe('ModalSubsidiariaComponent', () => {
  let component: ModalSubsidiariaComponent;
  let fixture: ComponentFixture<ModalSubsidiariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSubsidiariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSubsidiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
