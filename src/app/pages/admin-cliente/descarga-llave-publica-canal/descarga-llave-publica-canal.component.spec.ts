import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaLlavePublicaCanalComponent } from './descarga-llave-publica-canal.component';

describe('CifradoDescifradoComponent', () => {
  let component: DescargaLlavePublicaCanalComponent;
  let fixture: ComponentFixture<DescargaLlavePublicaCanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescargaLlavePublicaCanalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescargaLlavePublicaCanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
