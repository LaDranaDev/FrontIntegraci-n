import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ModalInfoBeanComponents } from '../../../bean/modal-info-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.css'],
})
export class ModalInfoComponent implements OnInit {
  radioSelectOpt = 0;
  constructor(
    public dialogRef: MatDialogRef<ModalInfoComponent>,
    private globals: Globals,
    @Inject(MAT_DIALOG_DATA) public data: ModalInfoBeanComponents,
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {}

  img: string;
  typeTitle: string;
  color: string;
  email: String | null;

  cancelar() {
    this.dialogRef.close();
  }

  ngOnInit() {
    // this.globals.loaderSubscripcion.emit(false);
    this.delegateType(this.data);
    this.email = this.data.emailToAddUpdate?.email ? this.data.emailToAddUpdate.email : null;
  }

  accept() {
    if(!this.data.emailToAddUpdate){
      this.dialogRef.close(this.data.type === 'selectAction' ? this.radioSelectOpt: "ok");
    }else {
      this.aceptWithEmail();
    }
  }

  respuesta(respuesta: string) {
    this.dialogRef.close(respuesta);
  }

  delegateType(data: ModalInfoBeanComponents) {
    /* 
general.alerts.alert          = Alert
general.alerts.error          = Error
general.alerts.info           = Info
general.alerts.ayuda          = Help
general.alerts.confirmar      = Confirm
general.alerts.aviso          = Aviso

this.openModalError(mensajes['msjERR001Titulo'], mensajes['msjERR001Observacion'],
mensajes['msjERR001Type'],mensajes['msjERR001Codigo'],mensajes['msjERR001Sugerencia']
);

convenios.errores.msjERR001Sugerencia	  	= No existe el Convenio en el cat\u00E1logo
convenios.errores.msjERR001Titulo		  	= Grupo Financiero Santander Mexicano 
convenios.errores.msjERR001Codigo		  	= ERR001
convenios.errores.msjERR001Observacion      = No es Posible Realizar la Operaci\u00f3n */

    switch (data.type) {
      case 'alert':
        this.img = '/assets/img/alerts/advertencia.gif';
        this.typeTitle = this.translateService.instant('modal.info.alerta');
        this.color = '#FFCC00';
        break;
      case 'error':
        this.img = '/assets/img/alerts/error.gif';
        this.typeTitle = this.translateService.instant('modal.info.error');
        this.color = '#FF0000';
        break;
      case 'info':
        this.img = '/assets/img/alerts/informacion.gif';
        this.typeTitle = 'Info';
        this.color = '#0071F8';
        break;
      case 'help':
        this.img = '/assets/img/alerts/ayuda.gif';
        this.typeTitle = this.translateService.instant('modal.info.ayuda');
        this.color = '#1DA8AF';
        break;
      case 'confirm':
        this.img = '/assets/img/alerts/ayuda.gif';
        this.typeTitle = this.translateService.instant('modal.info.confirmar');
        this.color = '#1DA8AF';
        break;
      case 'selectAction':
        this.img = 'assets/img/alerts/ayuda.gif';
        this.typeTitle = "Seleccionar";
        this.color = "#1DA8AF";
        break;
      case 'aviso':
        this.img = '/assets/img/alerts/informacion.gif';
        this.typeTitle = '';
        this.color = '#1DA8AF';
        break;
      case 'yesNo':
        this.img = '/assets/img/alerts/ayuda.gif';
        this.typeTitle = this.translateService.instant('modal.info.confirmar');
        this.color = '#1DA8AF';
        break;
    }

    if(this.data.emailToAddUpdate){
      this.img = '/assets/img/alerts/informacion.gif';
      this.typeTitle = 'Aviso';
      this.color = '#1DA8AF';
    }

  }

  aceptWithEmail(){
    if(!this.email){
      const dialogo = this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          this.translateService.instant('Error'),
          '',
          'error',
          'VAL001',
          this.translateService.instant('administracion.notificaciones.Noemail')
        ),
        hasBackdrop: true
      });
    }
    else if(this.email){
      if(this.esEmailValido(this.email as string)){
        this.dialogRef.close({ value: 'ok' , email: this.email})
      }else{
        const dialogo = this.dialog.open(ModalInfoComponent, {
          data: new ModalInfoBeanComponents(
            this.translateService.instant('Error'),
            '',
            'error',
            'VAL001',
            this.translateService.instant('administracion.notificaciones.novalidEmail')
          ),
          hasBackdrop: true
        });
      }
    }
  }

  esEmailValido(email: string):boolean {
    let mailValido = false;
      var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (email.match(EMAIL_REGEX)){
        mailValido = true;
      }
    return mailValido;
  }
}
