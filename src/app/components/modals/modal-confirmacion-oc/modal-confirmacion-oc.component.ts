import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalInfoBeanComponents } from '../../../bean/modal-info-bean.component';

@Component({
  selector: 'app-modal-confirmacion-oc',
  templateUrl: './modal-confirmacion-oc.component.html',
  //styleUrls: ['./modal-confirmacion-oc.component.css']
})
export class ModalConfirmacionOCComponent{

  constructor(public dialogRef: MatDialogRef<ModalConfirmacionOCComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalInfoBeanComponents) { }


  /***Funcion: realiza la peticion de la exportacion */
  respuesta(){
    this.dialogRef.close('si');
  }
}
