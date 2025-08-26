import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExportacionComponent } from './modal-exportacion.component';

describe('ModalExportacionComponent', () => {
  let component: ModalExportacionComponent;
  let fixture: ComponentFixture<ModalExportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalExportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
