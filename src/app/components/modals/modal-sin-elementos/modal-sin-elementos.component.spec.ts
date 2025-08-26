import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSinElementosComponent } from './modal-sin-elementos.component';

describe('ModalSinElementosComponent', () => {
  let component: ModalSinElementosComponent;
  let fixture: ComponentFixture<ModalSinElementosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSinElementosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSinElementosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
