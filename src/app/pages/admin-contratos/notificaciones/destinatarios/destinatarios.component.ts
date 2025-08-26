import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ActivatedRoute } from '@angular/router';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-destinatarios',
  templateUrl: './destinatarios.component.html',
  styleUrls: ['./destinatarios.component.css'],
})
export class DestinatariosComponent implements OnInit {
  emailRegex: string = "^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\\.)+([a-zA-Z0-9]{2,4})+$";
  updateActivate = false;
  notificacionList: any;
  requestSave: any;
  requestUpdate: any;
  register: any;
  responseDest: any;
  arrEvent: any[] = [];
  mailAnt: any;
  kindNot = new UntypedFormControl('', []);
  emailAccount = new UntypedFormControl('', []);
  check = new UntypedFormControl('', []);
  idNotiCntrGenerated: any;
  datos = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
  };

  matForm = this.fb.group({
    kindNot: this.kindNot,
    emailAccount: this.emailAccount,
    check: this.check,
  });

  constructor(
    private globals: Globals,
    private fb: UntypedFormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private service: NotificacionesService,
    private serviceCommon: ComunesService,
    public dialog: MatDialog,
    private translateService: TranslateService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.register = JSON.parse(atob(params.get('register') || '{}'));
    });
  }

  ngOnInit(): void {
    this.emailAccount.setValidators([Validators.pattern(this.emailRegex)]);
    this.datos = this.serviceCommon.getDatos();
    this.kindNot.setValue(this.register.nombreNoti);
    this.kindNot.disable();
    this.consultaDestinatarios(this.register);
  }

  consultaDestinatarios(register: any) {
    this.service
      .listaDestinatarios(register.idNotiCntr, register.constData)
      .then((resp: any) => {
        this.responseDest = resp.notificaciones;
        this.globals.loaderSubscripcion.emit(false);
      });
  }

  deleteDest() {
    let reg = 0;
    this.arrEvent.map((row) => {
      if (row.state === true) {
        this.service
          .eliminaDestinatarios(row.dest.idNotiCntr, row.dest.mails)
          .then((resp: any) => {
            if (resp.codError === 'OKC01' && reg === 0) {
              this.open(
                this.translateService.instant(
                  'notificaciones.contrato.msjINF006Titulo'
                ),
                this.translateService.instant(
                  'notificaciones.contrato.msjINF006Observacion'
                ),
                'info',
                this.translateService.instant(
                  'notificaciones.contrato.msjINF006Codigo'
                ),
                this.translateService.instant(
                  'notificaciones.contrato.msjINF006Sugerencia'
                )
              );
              reg = 1;
            }
            this.consultaDestinatarios(this.register);
            this.globals.loaderSubscripcion.emit(false);
          });

        let requestModificaNotificacionStatus = {
          idNotiCntr: this.idNotiCntrGenerated
            ? this.idNotiCntrGenerated
            : this.register.idNotiCntr,
          tipoDest: this.register.constData,
        };
        this.service
          .actualizaNotificaciones(requestModificaNotificacionStatus)
          .then((resp: any) => {
            this.globals.loaderSubscripcion.emit(false);
          });
      }
    });
    this.clearForm();
  }

  clearForm() {
    this.updateActivate = false;
    this.idNotiCntrGenerated = '';
    this.emailAccount.reset();
    this.arrEvent = [];
    this.mailAnt = '';
    this.check.setValue(false);
  }

  goBack(): void {
    this.clearForm();
    this.location.back();
  }

  async saveDest() {
    let duplicados = false;
    this.responseDest.map((dest: any) => {
      if ((dest.mails).toUpperCase() === (this.emailAccount.value).toUpperCase()) {
        duplicados = true;
      }
    });

    if(!this.updateActivate){
      let requestAgregaNotificacion = {
        idCntr: this.register.idCntrRoot,
        idNoti: this.register.idNoti,
        tipoDest: this.register.constData,
      };
  
      if (this.register.idNotiCntr === 0 || this.register.idNotiCntr === '0') {
        await this.service
          .agregaNotificaciones(requestAgregaNotificacion)
          .then(async (resp: any) => {
            this.idNotiCntrGenerated = resp.notificaciones[0].idNotiCntr;
            this.register.idNotiCntr = this.idNotiCntrGenerated;
            this.globals.loaderSubscripcion.emit(false);
          });
      }
  
      let request = {
        tipoDest: this.register.constData,
        idNotiCntr: this.idNotiCntrGenerated
          ? this.idNotiCntrGenerated
          : this.register.idNotiCntr,
        mails: this.emailAccount.value,
      };
      this.requestSave = request;
      
  
      if (
        this.emailAccount.value &&
        !this.emailAccount.hasError('pattern') &&
        !duplicados
      ) {
        this.openConfirmYN(
          this.translateService.instant('modals.parametros.confirmacion'),
          this.translateService.instant('modals.parametros.confirmacion.contenido'),
          'guardar'
        );
      } else {
        if (duplicados) {
          this.open(
            this.translateService.instant(
              'notificaciones.contrato.msjERR011Titulo'
            ),
            this.translateService.instant(
              'notificaciones.contrato.msjERR011Observacion'
            ),
            'error',
            this.translateService.instant(
              'notificaciones.contrato.msjERR011Codigo'
            ),
            this.translateService.instant(
              'notificaciones.contrato.msjERR011Sugerencia'
            )
          );
        } else {
          this.open(
            this.translateService.instant(
              'notificaciones.contrato.msjERR0003Titulo'
            ),
            this.translateService.instant(
              'notificaciones.contrato.msjERR0003Observacion'
            ),
            'error',
            this.translateService.instant(
              'notificaciones.contrato.msjERR0003Codigo'
            ),
            this.translateService.instant(
              'notificaciones.contrato.msjERR0003Sugerencia'
            )
          );
        }
      }
  
      let requestModificaNotificacionStatus = {
        idNotiCntr: this.idNotiCntrGenerated
          ? this.idNotiCntrGenerated
          : this.register.idNotiCntr,
        tipoDest: this.register.constData,
      };
      if (
        this.emailAccount.value &&
        !this.emailAccount.hasError('pattern') &&
        !duplicados
      ) {
        this.service
          .actualizaNotificaciones(requestModificaNotificacionStatus)
          .then((resp: any) => {
            this.globals.loaderSubscripcion.emit(false);
          });
      }
    }
    
  }

  putValue(email: any) {
    this.updateActivate = true;
    this.emailAccount.setValue(email);
    this.mailAnt = email;
  }

  updateDest() {
      if(this.updateActivate){
        if (this.emailAccount.value && !this.emailAccount.hasError('pattern')) {
          let request = {
            tipoDest: this.register.constData,
            idNotiCntr: this.idNotiCntrGenerated
              ? this.idNotiCntrGenerated
              : this.register.idNotiCntr,
            mails: this.emailAccount.value,
            mailAnt: this.mailAnt,
          };
          this.requestUpdate = request;
          this.openConfirmYN(
            this.translateService.instant('modals.parametros.confirmacion'),
            this.translateService.instant('modals.parametros.confirmacion.contenido'),
            'modificar'
          );
        } else {
          this.open(
            this.translateService.instant(
              'notificaciones.contrato.msjERR0003Titulo'
            ),
            this.translateService.instant(
              'notificaciones.contrato.msjERR0003Observacion'
            ),
            'error',
            this.translateService.instant(
              'notificaciones.contrato.msjERR0003Codigo'
            ),
            this.translateService.instant(
              'notificaciones.contrato.msjERR0003Sugerencia'
            )
          );
        }
      }
  }

  checkEmail(dest: any, checkState: any) {
    let add = true;
    if (this.arrEvent.length > 0) {
      this.arrEvent.map((row: any, index: any) => {
        if (
          dest.idNotiCntr === row.dest.idNotiCntr &&
          dest.mails === row.dest.mails &&
          dest.tipoDest === row.dest.tipoDest
        ) {
          add = false;
          this.arrEvent[index] = { dest: dest, state: false };
        }
      });
    }
    if (add) this.arrEvent.push({ dest: dest, state: checkState.checked });
  }

  openModal() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.onClickExportarGC(result);
      }
    });
  }

  onClickExportarGC(tipoExportacion: string) {
    this.openModalError('Error', 'Error 500 backend');
    this.globals.loaderSubscripcion.emit(false);
  }

  openModalError(titulo: String, contenido: String) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido), hasBackdrop: true 
    });
  }

  open(
    titulo: string,
    contenido: string,
    type?: any,
    code?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ), hasBackdrop: true 
    });
  }

  openConfirmYN(titulo: string, contenido: string, typeConfirm: string): void {
    if (typeConfirm === 'eliminar' && this.arrEvent.length <= 0) {
      this.open(this.translateService.instant('menu.adminContrato.notificaciones'), this.translateService.instant('pantalla.adminContrato.noEmailSelected'), "error");
      return;
    }
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, "yesNo"), hasBackdrop: true 
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result === 'si' && typeConfirm === 'guardar') {
        this.saveAnDestinatary(this.requestSave);
      }
      if (result === 'si' && typeConfirm === 'modificar') {
        if (this.mailAnt.toUpperCase() === this.emailAccount.value.toUpperCase()) {
          this.open(
            this.translateService.instant(
              'notificaciones.contrato.msjERR011Titulo'
            ),
            this.translateService.instant(
              'notificaciones.contrato.msjERR011Observacion'
            ),
            'error',
            this.translateService.instant(
              'notificaciones.contrato.msjERR011Codigo'
            ),
            this.translateService.instant(
              'notificaciones.contrato.msjERR011Sugerencia'
            )
          );
          this.clearForm();
        } else{
          this.updateAnDestinatary(this.requestUpdate);
        }
        
      }
      if (result === 'si' && typeConfirm === 'eliminar') {
        this.deleteDest();
      }
    });
  }

  saveAnDestinatary(request: any) {
    this.service.agregaDestinatarios(request).then((resp: any) => {
      if (resp.codError == 'OKC01') {
        this.open(
          this.translateService.instant(
            'notificaciones.contrato.msjINF001Titulo'
          ),
          this.translateService.instant(
            'notificaciones.contrato.msjINF001Observacion'
          ),
          'info',
          this.translateService.instant(
            'notificaciones.contrato.msjINF001Codigo'
          )
        );
      }
      this.consultaDestinatarios(this.register);
      this.clearForm();
    });
  }

  updateAnDestinatary(request: any) {
    
    this.service.actualizaDestinatarios(request).then((resp: any) => {
      this.updateActivate = false;
      if (resp.codError == 'OKC01') {
        this.open(
          this.translateService.instant('pantalla.destinatarios.actualizado'),
          this.translateService.instant('pantalla.destinatarios.registro.actualizado'),
          'aviso'
        );
      }
      this.consultaDestinatarios(this.register);
      this.globals.loaderSubscripcion.emit(false);
      this.clearForm();
    });
  }
}
