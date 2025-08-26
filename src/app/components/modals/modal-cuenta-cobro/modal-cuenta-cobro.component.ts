import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanCorreoComponents } from 'src/app/bean/modal-info-bean-correo.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { ConsultasComisionesService } from 'src/app/services/consultas-comisiones.service';

@Component({
  selector: 'app-modal-cuenta-cobro',
  templateUrl: './modal-cuenta-cobro.component.html',
  styleUrls: ['./modal-cuenta-cobro.component.css']
})
export class ModalCuentaCobroComponent implements OnInit {

  
  cuentaCobroForm: FormGroup;
  img: string;
  typeTitle: string;
  color: string;
  constructor(
    public dialog: MatDialog,
    private globals: Globals,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ModalInfoBeanCorreoComponents,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ModalCuentaCobroComponent>,
    private service: ConsultasComisionesService
  ) { 
    
  }

  ngOnInit(): void {
    this.cuentaCobroForm = this.formBuilder.group({
      cuentaCobro: [this.data.data.ctaOrdenante],
    });
    this.globals.loaderSubscripcion.emit(false);
    this.delegateType();
  }

  async accept() {
    if(this.data.data.ctaOrdenante === this.cuentaCobroForm.value.cuentaCobro){
      this.open(
        this.translate.instant('Error'),
        '',
        'error',
        this.translate.instant('ERROR0007'),
        this.translate.instant('newCuenta')
      );
      return
    }
    if( this.cuentaCobroForm.value.cuentaCobro.length == 11 || 
        this.cuentaCobroForm.value.cuentaCobro.length == 16 || 
        this.cuentaCobroForm.value.cuentaCobro.length == 18 ){
        try {
          const result = await this.service.modificaCuentaCobro({
            idClte: this.data.data.bucCliente,
            numCta: this.data.data.ctaOrdenante,
            idContrato: this.data.data.idContrato,
            nvaCtaCobro: this.cuentaCobroForm.value.cuentaCobro
          });
          this.globals.loaderSubscripcion.emit(false);
          if (result.result.code !== 'OK00000') {
            this.open(
              this.translate.instant('pantalla.archivo.consulta.msjERRTitulo'),
              '',
              'error',
              result.result.code,
              result.result.mensaje
            );
          } else {
            this.data.data.ctaOrdenante = this.cuentaCobroForm.value.cuentaCobro;
            this.dialogRef.close({success: true});
          }
        } catch (error) {
          this.open(
            this.translate.instant('pantalla.archivo.consulta.msjERRTitulo'),
            '',
            'error',
            '',
            this.translate.instant('ED')
          )
          this.dialogRef.close({success: false});
          this.globals.loaderSubscripcion.emit(false);
        }
      
    }
    else{
      this.open(
        this.translate.instant('Error'),
        '',
        'error',
        this.translate.instant('ERROR0007'),
        this.translate.instant('digi')
      );
      return
    }
  }


  delegateType(){
        this.img = '/assets/img/alerts/informacion.gif';
        this.typeTitle = "Ayuda";
        this.color = "#1DA8AF";
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
