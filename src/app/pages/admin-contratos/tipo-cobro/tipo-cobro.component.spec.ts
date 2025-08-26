import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCobroComponent } from './tipo-cobro.component';

describe('TipoCobroComponent', () => {
  let component: TipoCobroComponent;
  let fixture: ComponentFixture<TipoCobroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoCobroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
