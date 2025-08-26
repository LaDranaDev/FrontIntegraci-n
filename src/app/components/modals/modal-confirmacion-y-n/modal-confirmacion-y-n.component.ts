import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalInfoBeanComponents } from '../../../bean/modal-info-bean.component';

@Component({
  selector: 'app-modal-confirmacion-y-n',
  templateUrl: './modal-confirmacion-y-n.component.html',
})
export class ModalConfirmacionYNComponent {

  constructor(public dialogRef: MatDialogRef<ModalConfirmacionYNComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalInfoBeanComponents) { }


  /***Funcion: realiza la peticion de la exportacion */
  respuesta(respuesta: string){
    this.dialogRef.close(respuesta);
  }

}
