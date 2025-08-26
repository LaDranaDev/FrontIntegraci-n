import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnaCuentaComponent } from './una-cuenta.component';

describe('UnaCuentaComponent', () => {
  let component: UnaCuentaComponent;
  let fixture: ComponentFixture<UnaCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnaCuentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnaCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
