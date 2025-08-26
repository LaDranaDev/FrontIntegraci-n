import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelOperacionHistoricoComponent } from './nivel-operacion-historico.component';

describe('NivelOperacionHistoricoComponent', () => {
  let component: NivelOperacionHistoricoComponent;
  let fixture: ComponentFixture<NivelOperacionHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelOperacionHistoricoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelOperacionHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
