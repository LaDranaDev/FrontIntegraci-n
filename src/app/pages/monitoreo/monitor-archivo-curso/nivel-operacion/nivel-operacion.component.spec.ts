import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelOperacionComponent } from './nivel-operacion.component';

describe('NivelOperacionComponent', () => {
  let component: NivelOperacionComponent;
  let fixture: ComponentFixture<NivelOperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelOperacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelOperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
