import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CifradoDescifradoComponent } from './cifrado-descifrado.component';

describe('CifradoDescifradoComponent', () => {
  let component: CifradoDescifradoComponent;
  let fixture: ComponentFixture<CifradoDescifradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CifradoDescifradoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CifradoDescifradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
