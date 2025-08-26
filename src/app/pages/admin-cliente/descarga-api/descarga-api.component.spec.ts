import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaApiComponent } from './descarga-api.component';

describe('DescargaApiComponent', () => {
  let component: DescargaApiComponent;
  let fixture: ComponentFixture<DescargaApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescargaApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescargaApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
