import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-monitor-operaciones-online',
  templateUrl: './monitor-operaciones-online.component.html'
})

export class MonitorOperacionesOnlineComponent{

  fechaInicial!: string;
  fechaFinal!: string;
  public formControl: UntypedFormControl = new UntypedFormControl(null);
  public formControl2: UntypedFormControl = new UntypedFormControl(null);

  constructor(public translate: TranslateService,private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) {}

   get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }


}
