import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ReportesConfirmingService } from 'src/app/services/admin-contratos/reportes-confirming.service';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-pago-directo',
  templateUrl: './pago-directo.component.html',
  styleUrls: ['./pago-directo.component.css']
})
export class PagoDirectoComponent implements OnInit {
  datos: any;

  datosContrato: DatosCuentaBeanComponent = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
  };

  clickSuscliption: Subscription | undefined;

  constructor(
    private service: ComunesService, 
    private translate: TranslateService,
    private reportesConfirmingService: ReportesConfirmingService,
    public dialog: MatDialog,
    private globals: Globals,
  ) { }

  ngOnInit(): void {
    this.clickSuscliption = this.service.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 18) {
        this.datos = this.service.datosContrato;
        this.datosContrato = this.datos;

      }
    });
  }

  open(
    titulo: string,
    obser: string,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    errorCode?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        obser,
        type,
        errorCode,
        sugerencia
      ), hasBackdrop: true
    });
  }

}
