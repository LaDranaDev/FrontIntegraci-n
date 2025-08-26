import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { InsCambioEstatusRequest } from 'src/app/bean/solicitud-cambio-estatus.components';
import { SolicitudCambioEstatusService } from 'src/app/services/contingencia/solicitud-cambio-estatus.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';

@Component({
  selector: 'app-modal-solicitud-cambio-estatus',
  templateUrl: './modal-solicitud-cambio-estatus.component.html',
  styleUrls: ['./modal-solicitud-cambio-estatus.component.css']
})
export class ModalSolicitudCambioEstatusComponent implements OnInit {

  @Input() bandera: string;
  @Input() insCambioEstatusRequest: InsCambioEstatusRequest;

  img: string;
  color: string;

  constructor(private translate: TranslateService, private globals: Globals, private solicitudCambioEstatusService: SolicitudCambioEstatusService,
    public modalRef: MdbModalRef<ModalSolicitudCambioEstatusComponent>, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.img = '/assets/img/alerts/ayuda.gif';
    this.color = '#1DA8AF';
  }

  onEnviar() {
    this.solicitudCambioEstatusService.insCambioEstatus(this.insCambioEstatusRequest).then((resp: any) => {
      this.modalRef.close(resp.error === 'INF001' ? true: false);
    }).catch(() => {
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          this.translate.instant('planCalidad.cambioEst.msjINF011xTitulo'),
          this.translate.instant('planCalidad.msjErrConsultarOp'),
          'error',
          this.translate.instant('contingencia.msjERR001Codigo'),
          ''
        ),
      });
      this.modalRef.close(false);
    }).finally(() => {
      this.modalRef.close(false);
      this.globals.loaderSubscripcion.emit(false);
    });
  }

  /**
  * @description evento para poder levantar el modal para mostrar los mensajes de sucess o error
  * @param titulo indica si se ejecutara para error o success
  * @param contenido mensaje que se mostrara en el modal
  */
  open(titulo: String, contenido: String, type?: any, errorCode?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, errorCode, sugerencia)
    });
  }

}
