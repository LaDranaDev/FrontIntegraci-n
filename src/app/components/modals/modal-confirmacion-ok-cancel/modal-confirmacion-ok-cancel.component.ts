import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalInfoBeanComponents } from '../../../bean/modal-info-bean.component';

@Component({
  selector: 'app-modal-confirmacion-ok-cancel',
  templateUrl: './modal-confirmacion-ok-cancel.component.html'
})
export class ModalConfirmacionOkCancelComponent {

  constructor(public dialogRef: MatDialogRef<ModalConfirmacionOkCancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalInfoBeanComponents) { }

  /**Realiza la peticion*/
  respuesta(respuesta: string){
    this.dialogRef.close(respuesta);
  }

}
