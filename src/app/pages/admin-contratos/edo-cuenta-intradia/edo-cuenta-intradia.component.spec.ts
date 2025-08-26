import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdoCuentaIntradiaComponent } from './edo-cuenta-intradia.component';

describe('EdoCuentaIntradiaComponent', () => {
  let component: EdoCuentaIntradiaComponent;
  let fixture: ComponentFixture<EdoCuentaIntradiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdoCuentaIntradiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdoCuentaIntradiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
